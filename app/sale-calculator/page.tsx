"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { money } from "@/lib/calculations";

export default function SaleCalculator() {
  const [price,setPrice]=useState(100);
  const [cost,setCost]=useState(60);
  const [feePct,setFeePct]=useState(12.8);
  const [fixed,setFixed]=useState(0.30);
  const [postage,setPostage]=useState(5);
  const [pack,setPack]=useState(1);
  const result=useMemo(()=>{
    const fees=price*feePct/100+fixed;
    const net=price-fees-postage-pack;
    return {fees,net,profit:net-cost,recovery:cost?net/cost*100:0};
  },[price,cost,feePct,fixed,postage,pack]);
  return <><header><div className="container nav"><Link className="brand" href="/">Item Value Tracker</Link><Link className="button" href="/">Dashboard</Link></div></header>
  <main className="container"><h1>Sale calculator</h1><p className="muted">Work out what a sale actually leaves you after fees and costs.</p>
  <div className="card form"><div className="fields">
    <div className="field"><label>Sale price (£)</label><input type="number" step=".01" value={price} onChange={e=>setPrice(+e.target.value)}/></div>
    <div className="field"><label>Total invested (£)</label><input type="number" step=".01" value={cost} onChange={e=>setCost(+e.target.value)}/></div>
    <div className="field"><label>Platform fee (%)</label><input type="number" step=".1" value={feePct} onChange={e=>setFeePct(+e.target.value)}/></div>
    <div className="field"><label>Fixed fee (£)</label><input type="number" step=".01" value={fixed} onChange={e=>setFixed(+e.target.value)}/></div>
    <div className="field"><label>Postage (£)</label><input type="number" step=".01" value={postage} onChange={e=>setPostage(+e.target.value)}/></div>
    <div className="field"><label>Packaging (£)</label><input type="number" step=".01" value={pack} onChange={e=>setPack(+e.target.value)}/></div>
  </div><section className="grid stats" style={{marginBottom:0}}>
    <div><div className="muted">Fees</div><div className="stat-value">{money(result.fees)}</div></div>
    <div><div className="muted">Net cash</div><div className="stat-value">{money(result.net)}</div></div>
    <div><div className="muted">Profit / loss</div><div className={"stat-value "+(result.profit>=0?"positive":"negative")}>{money(result.profit)}</div></div>
    <div><div className="muted">Recovery</div><div className="stat-value">{result.recovery.toFixed(0)}%</div></div>
  </section></div></main></>;
}