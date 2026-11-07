// 1) Create a Firebase Web App and paste its config below.
// 2) Enable Authentication > Email/Password and Firestore Database.
// 3) Apply the firestore.rules file before using real documents.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  appId: "PASTE_YOUR_FIREBASE_APP_ID"
};
const configured = !firebaseConfig.apiKey.startsWith("PASTE_");
const categories = [
  ["Aadhaar Card","🪪"],["PAN Card","💳"],["Voter ID","🗳️"],["Education","🎓"],
  ["Caste Certificate","📄"],["Income Certificate","📑"],["Bank Documents","🏦"],["Photo Gallery","🖼️"],["Other Documents","📁"]
];
const $ = id => document.getElementById(id);
let mode="login", user=null, activeCategory="All documents", allDocs=[];
let auth, db;
if(configured){const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);}
const authForm=$("authForm"), authMessage=$("authMessage");
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.tab;document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));$("authTitle").textContent=mode==="login"?"Welcome back":"Create your wallet";$("authSubtitle").textContent=mode==="login"?"Login to open your document wallet.":"Register with your email and a strong password.";$("authSubmit").textContent=mode==="login"?"Login securely":"Create account";authMessage.textContent="";}));
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2600)}
function showWallet(u){user=u;$("authView").classList.add("hidden");$("walletView").classList.remove("hidden");$("logoutBtn").classList.remove("hidden");$("userEmail").textContent=u.email;renderCategories();loadDocs();}
function showAuth(){$("walletView").classList.add("hidden");$("authView").classList.remove("hidden");$("logoutBtn").classList.add("hidden");}
authForm.addEventListener("submit",async e=>{e.preventDefault();authMessage.textContent="";if(!configured){authMessage.textContent="Firebase setup pending: open README and paste your Firebase web app config in app.js.";return;}try{const email=$("email").value.trim(),pass=$("password").value;if(mode==="signup")await createUserWithEmailAndPassword(auth,email,pass);else await signInWithEmailAndPassword(auth,email,pass);}catch(err){authMessage.textContent=err.message;}});
$("logoutBtn").addEventListener("click",()=>signOut(auth));
if(configured)onAuthStateChanged(auth,u=>u?showWallet(u):showAuth());
function renderCategories(){const root=$("categories");root.innerHTML="";[["All documents","▦"],...categories].forEach(([name,ico])=>{const count=name==="All documents"?allDocs.length:allDocs.filter(d=>d.category===name).length;const b=document.createElement("button");b.className="category"+(activeCategory===name?" selected":"");b.innerHTML=`<span class="ico">${ico}</span><b>${name}</b><small>${count} file(s)</small>`;b.onclick=()=>{activeCategory=name;renderCategories();renderDocs();};root.append(b);});}
async function loadDocs(){try{const q=query(collection(db,"users",user.uid,"documents"),orderBy("createdAt","desc"));const snap=await getDocs(q);allDocs=snap.docs.map(x=>({id:x.id,...x.data()}));renderCategories();renderDocs();}catch(e){toast("Could not load files. Check Firestore rules.");}}
function renderDocs(){const term=$("searchInput").value.toLowerCase();const rows=allDocs.filter(d=>(activeCategory==="All documents"||d.category===activeCategory)&&d.name.toLowerCase().includes(term));$("listTitle").textContent=activeCategory;const root=$("documents");root.innerHTML="";if(!rows.length){root.innerHTML='<div class="empty">No documents here yet.<br>Use “Add document” to upload your first file.</div>';return;}rows.forEach(d=>{const el=document.createElement("div");el.className="doc";el.innerHTML=`<div class="file-ico">${d.type==="application/pdf"?"📕":"🖼️"}</div><div class="doc-info"><b></b><small>${d.category} · ${formatSize(d.size)}</small></div><div class="doc-actions"><button class="small-btn view">View / Download</button><button class="small-btn delete">Delete</button></div>`;el.querySelector(".doc-info b").textContent=d.name;el.querySelector(".view").onclick=()=>downloadDoc(d);el.querySelector(".delete").onclick=()=>removeDoc(d);root.append(el);});}
function formatSize(n){return n<1024?`${n} B`:`${(n/1024).toFixed(0)} KB`;}
$("searchInput").addEventListener("input",renderDocs);
$("fileInput").addEventListener("change",async e=>{const file=e.target.files[0];e.target.value="";if(!file)return;if(file.size>650*1024){toast("File is too large. Maximum 650 KB in this starter.");return;}if(!["application/pdf","image/jpeg","image/png","image/webp"].includes(file.type)){toast("Please choose PDF, JPG, PNG or WEBP.");return;}const category=prompt("Choose category number:\\n"+categories.map((c,i)=>`${i+1}. ${c[0]}`).join("\\n"),"8");const idx=Number(category)-1;if(!Number.isInteger(idx)||idx<0||idx>=categories.length)return;try{const data=await toBase64(file);await addDoc(collection(db,"users",user.uid,"documents"),{name:file.name,category:categories[idx][0],type:file.type,size:file.size,data,createdAt:Date.now()});toast("Document uploaded.");await loadDocs();}catch(err){toast("Upload failed: "+err.message);}});
function toBase64(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
function downloadDoc(d){const a=document.createElement("a");a.href=d.data;a.download=d.name;a.target="_blank";document.body.append(a);a.click();a.remove();}
async function removeDoc(d){if(!confirm(`Delete ${d.name}?`))return;try{await deleteDoc(doc(db,"users",user.uid,"documents",d.id));toast("Document deleted.");await loadDocs();}catch(e){toast("Delete failed.");}}
