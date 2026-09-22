"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const CATEGORIES = [
  "3D Printing",
  "Tools & Workshop",
  "PC & Gaming",
  "Networking & Electronics",
  "Home Improvement",
  "DIY & Hardware",
  "Automotive",
  "Household",
  "Photography & Audio",
  "Outdoor & Camping",
  "Collectibles",
  "Clothing & Personal",
  "Other"
];

export default function EditItem(){
 const {id}=useParams<{id:string}>(); const router=useRouter(); const [item,setItem]=useState<any>(null); const [error,setError]=useState("");
 useEffect(()=>{fetch("/api/items/"+id).then(async r=>{if(!r.ok)throw new Error("Could not load item.");return r.json()}).then(setItem).catch(e=>setError(e.message))},[id]);
 if(error) return <main className="container"><p className="negative">{error}</p><a className="button" href="/">Back to dashboard</a></main>;
 if(!item) return <main className="container"><p>Loading...</p></main>;
 async function save(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError("");const f=Object.fromEntries(new FormData(e.currentTarget).entries());const r=await fetch("/api/items/"+id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});if(!r.ok){setError(await r.text());return}router.push("/items/"+id)}
 async function remove(){if(!confirm("Delete this item?"))return;const r=await fetch("/api/items/"+id,{method:"DELETE"});if(r.ok)router.push("/");else setError("Could not delete item.")}
 const val=(k:string)=>item[k] ?? "";
 return <><header><div className="container nav"><a className="brand" href="/">Item Value Tracker</a></div></header><main className="container"><p><a className="muted" href={"/items/"+id}>← Back to item</a></p><h1>Edit item</h1><form className="card form" onSubmit={save}><div className="fields">
 <div className="field full"><label>Name</label><input name="name" defaultValue={val("name")} required/></div>
 <div className="field"><label>Category</label><select name="category" defaultValue={val("category")||"Other"}>{CATEGORIES.map(category=><option key={category} value={category}>{category}</option>)}</select></div><div className="field"><label>Status</label><select name="status" defaultValue={val("status")}><option value="owned">Owned</option><option value="for-sale">For sale</option><option value="sold">Sold</option><option value="disposed">Disposed</option></select></div>
 <div className="field"><label>Purchase date</label><input name="purchaseDate" type="date" defaultValue={String(val("purchaseDate")).slice(0,10)} required/></div><div className="field"><label>Purchase price (£)</label><input name="purchasePrice" type="number" step=".01" defaultValue={val("purchasePrice")} required/></div>
 <div className="field"><label>Extra costs (£)</label><input name="additionalCosts" type="number" step=".01" defaultValue={val("additionalCosts")}/></div><div className="field"><label>Current value (£)</label><input name="currentValue" type="number" step=".01" defaultValue={val("currentValue")}/></div>
 <div className="field"><label>Target sale price (£)</label><input name="targetSalePrice" type="number" step=".01" defaultValue={val("targetSalePrice")}/></div><div className="field"><label>Sale platform</label><input name="salePlatform" defaultValue={val("salePlatform")} placeholder="eBay / Facebook / Gumtree"/></div>
 <div className="field"><label>Sale fees (£)</label><input name="saleFees" type="number" step=".01" defaultValue={val("saleFees")}/></div><div className="field"><label>Shipping (£)</label><input name="shippingCost" type="number" step=".01" defaultValue={val("shippingCost")}/></div>
 <div className="field"><label>Packaging (£)</label><input name="packagingCost" type="number" step=".01" defaultValue={val("packagingCost")}/></div><div className="field"><label>Hours used</label><input name="hoursUsed" type="number" step=".1" defaultValue={val("hoursUsed")}/></div>
 <div className="field"><label>Serial / model</label><input name="serialModel" defaultValue={val("serialModel")}/></div><div className="field"><label>Where bought</label><input name="source" defaultValue={val("source")}/></div>
 <div className="field"><label>Condition bought</label><input name="conditionBought" defaultValue={val("conditionBought")}/></div><div className="field"><label>Current condition</label><input name="conditionCurrent" defaultValue={val("conditionCurrent")}/></div>
 <div className="field full"><label>Photo URL</label><input name="photoUrl" defaultValue={val("photoUrl")}/></div><div className="field full"><label>Receipt URL</label><input name="receiptUrl" defaultValue={val("receiptUrl")}/></div>
 <div className="field full"><label>Notes</label><textarea name="notes" defaultValue={val("notes")}/></div>
 </div>{error&&<p className="negative">{error}</p>}<div className="actions"><button className="button primary">Save changes</button><a className="button" href={"/items/"+id}>Cancel</a><button type="button" className="button" onClick={remove}>Delete item</button></div></form></main></>
}
