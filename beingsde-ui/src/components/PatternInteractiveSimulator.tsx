"use client";

import React, { useState } from "react";
import { 
  Play, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Layers, 
  Plus, 
  Trash2, 
  Send, 
  Terminal, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Coffee,
  Cpu,
  CreditCard
} from "lucide-react";
import { DesignPattern } from "@/data/design-patterns";

interface Props {
  pattern: DesignPattern;
}

export default function PatternInteractiveSimulator({ pattern }: Props) {
  // ── Strategy Pattern State ──
  const [strategyType, setStrategyType] = useState<"cc" | "upi" | "paypal" | "crypto">("upi");
  const [orderAmount, setOrderAmount] = useState<number>(250);
  const [strategyLogs, setStrategyLogs] = useState<string[]>([
    "System initialized with default payment strategy: UPI FastPay",
  ]);

  // ── Observer Pattern State ──
  const [observers, setObservers] = useState([
    { id: "email", name: "Email Notification Service", active: true },
    { id: "slack", name: "Slack #sales-alerts Channel", active: true },
    { id: "sms", name: "SMS Gateway (Twilio)", active: false },
    { id: "audit", name: "Kafka Audit Logger", active: true },
  ]);
  const [observerEvent, setObserverEvent] = useState("OrderCreated");
  const [observerLogs, setObserverLogs] = useState<string[]>([]);

  // ── Builder Pattern State ──
  const [builderConfig, setBuilderConfig] = useState({
    cpu: "Intel Core i9 14900K",
    ramGb: 32,
    gpu: "NVIDIA RTX 4090 (24GB)",
    liquidCooling: true,
    wifi: true,
    storage: "2TB NVMe SSD",
  });

  // ── Decorator Pattern State ──
  const [baseDrink, setBaseDrink] = useState<"espresso" | "coldbrew">("espresso");
  const [decorators, setDecorators] = useState<string[]>(["milk", "caramel"]);

  // ── Chain of Responsibility State ──
  const [chainSteps, setChainSteps] = useState({
    authPassed: true,
    rateLimitPassed: true,
    payloadValid: true,
  });
  const [chainResult, setChainResult] = useState<string | null>(null);

  // ── State Pattern State ──
  const [docState, setDocState] = useState<"DRAFT" | "MODERATION" | "PUBLISHED">("DRAFT");
  const [docContent, setDocContent] = useState("System architecture technical spec v1.0");
  const [stateLog, setStateLog] = useState<string>("Document created in DRAFT state.");

  // ── Factory Pattern State ──
  const [factoryOS, setFactoryOS] = useState<"windows" | "mac" | "linux">("mac");

  // ── Singleton Simulator State ──
  const [singletonLogs, setSingletonLogs] = useState<string[]>([]);
  const [simulatedInstanceHash, setSimulatedInstanceHash] = useState("0x7f8a9b2c");

  // Strategy Execution
  const handleExecuteStrategy = () => {
    let fee = 0;
    let detail = "";
    if (strategyType === "cc") {
      fee = orderAmount * 0.02;
      detail = `Charged $${(orderAmount + fee).toFixed(2)} ($${fee.toFixed(2)} 2% interchange fee) via Credit Card ending in 4242`;
    } else if (strategyType === "upi") {
      fee = 0;
      detail = `Transferred $${orderAmount.toFixed(2)} (0% fee) via UPI VPA: user@okaxis`;
    } else if (strategyType === "paypal") {
      fee = orderAmount * 0.035;
      detail = `Paid $${(orderAmount + fee).toFixed(2)} via PayPal Express Checkout`;
    } else {
      fee = 1.5;
      detail = `Broadcasted 0.0034 BTC on Bitcoin network (Network Gas Fee: $1.50)`;
    }

    setStrategyLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] SWAP STRATEGY -> ${strategyType.toUpperCase()}`,
      `[${new Date().toLocaleTimeString()}] ${detail}`,
      ...prev.slice(0, 4),
    ]);
  };

  // Observer Broadcast
  const handleBroadcastEvent = () => {
    const activeSubscribers = observers.filter((o) => o.active);
    const newLogs = [
      `📢 [EVENT FIRED] Subject published: "${observerEvent}" at ${new Date().toLocaleTimeString()}`,
      ...activeSubscribers.map(
        (sub) => `  ↳ [DISPATCHED] ${sub.name} received payload for "${observerEvent}"`
      ),
    ];
    setObserverLogs(newLogs);
  };

  // Decorator Calculation
  const getDrinkPrice = () => {
    let price = baseDrink === "espresso" ? 2.5 : 3.25;
    if (decorators.includes("milk")) price += 0.5;
    if (decorators.includes("caramel")) price += 0.75;
    if (decorators.includes("whip")) price += 0.6;
    if (decorators.includes("vanilla")) price += 0.4;
    return price.toFixed(2);
  };

  const getDrinkDescription = () => {
    const base = baseDrink === "espresso" ? "Dark Roast Espresso" : "Nitro Cold Brew";
    const extras = decorators.map((d) => {
      if (d === "milk") return "Steamed Oat Milk";
      if (d === "caramel") return "Caramel Drizzle";
      if (d === "whip") return "Whipped Cream";
      return "Vanilla Bean Syrup";
    });
    return [base, ...extras].join(" + ");
  };

  // Chain of Responsibility Execution
  const handleRunChain = () => {
    if (!chainSteps.authPassed) {
      setChainResult("❌ Chain Halted at Step 1: 401 Unauthorized (Auth Token Invalid)");
      return;
    }
    if (!chainSteps.rateLimitPassed) {
      setChainResult("❌ Chain Halted at Step 2: 429 Too Many Requests (Rate limit breached: 100 req/min)");
      return;
    }
    if (!chainSteps.payloadValid) {
      setChainResult("❌ Chain Halted at Step 3: 422 Unprocessable Entity (Payload JSON schema mismatch)");
      return;
    }
    setChainResult("✅ Success: All 3 Middleware Handlers passed -> Request arrived at Controller!");
  };

  // State transitions
  const handleStateAction = (action: "edit" | "submit" | "publish" | "reject") => {
    if (docState === "DRAFT") {
      if (action === "edit") {
        setStateLog("Document content edited successfully.");
      } else if (action === "submit") {
        setDocState("MODERATION");
        setStateLog("Document transitioned from DRAFT -> MODERATION.");
      } else if (action === "publish") {
        setStateLog("❌ ILLEGAL TRANSITION: Draft cannot be published without passing Moderation!");
      } else {
        setStateLog("Draft is already at the initial state.");
      }
    } else if (docState === "MODERATION") {
      if (action === "edit") {
        setStateLog("❌ BLOCKED: Cannot edit while document is undergoing review!");
      } else if (action === "publish") {
        setDocState("PUBLISHED");
        setStateLog("Document approved! Transitioned from MODERATION -> PUBLISHED (Live).");
      } else if (action === "reject") {
        setDocState("DRAFT");
        setStateLog("Review rejected. Transitioned from MODERATION -> DRAFT for revisions.");
      }
    } else if (docState === "PUBLISHED") {
      if (action === "edit") {
        setStateLog("❌ ILLEGAL: Published documents are immutable. Create a new revision.");
      } else if (action === "reject") {
        setDocState("DRAFT");
        setStateLog("Unpublished document. Transitioned back to DRAFT.");
      } else {
        setStateLog("Document is already live.");
      }
    }
  };

  // Singleton Multithreaded Simulation
  const handleSimulateThreads = () => {
    const threadOutputs = [
      `Thread #1 called DatabasePool.getInstance() -> Returned reference @${simulatedInstanceHash}`,
      `Thread #2 called DatabasePool.getInstance() -> Returned reference @${simulatedInstanceHash}`,
      `Thread #3 called DatabasePool.getInstance() -> Returned reference @${simulatedInstanceHash}`,
      `Thread #4 called DatabasePool.getInstance() -> Returned reference @${simulatedInstanceHash}`,
      `Thread #5 called DatabasePool.getInstance() -> Returned reference @${simulatedInstanceHash}`,
      `✅ VERIFICATION: All 5 threads received IDENTICAL memory reference @${simulatedInstanceHash} (Zero duplicate allocations).`,
    ];
    setSingletonLogs(threadOutputs);
  };

  return (
    <div className="rounded-lg border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-[#151518] p-5 sm:p-7 shadow-md flex flex-col gap-6">
      {/* Simulator Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-mono text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <span>Interactive {pattern.name} Simulator</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                LIVE PLAYGROUND
              </span>
            </h3>
            <p className="text-2xs text-zinc-500 font-mono mt-0.5">
              Interact with the controls below to see how this design pattern executes in memory at runtime.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-zinc-400">
          Category: <strong className="text-zinc-800 dark:text-zinc-200">{pattern.category}</strong>
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. STRATEGY SIMULATOR                                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {pattern.interactiveType === "strategy" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Controls */}
            <div className="flex flex-col gap-4 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                1. Select Interchangeable Strategy:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "upi", label: "UPI FastPay (0% Fee)", icon: "⚡" },
                  { id: "cc", label: "Credit Card (2% Fee)", icon: "💳" },
                  { id: "paypal", label: "PayPal (3.5% Fee)", icon: "🅿️" },
                  { id: "crypto", label: "Bitcoin (Gas Fee)", icon: "₿" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStrategyType(s.id as any)}
                    className={`p-2.5 rounded text-xs font-mono text-left transition-all border cursor-pointer ${
                      strategyType === s.id
                        ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-bold border-zinc-900 dark:border-zinc-100 shadow-xs"
                        : "bg-white dark:bg-[#18181b] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    <span className="mr-1">{s.icon}</span> {s.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <label className="text-2xs font-mono text-zinc-500">Order Amount ($)</label>
                <input
                  type="number"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(Math.max(1, Number(e.target.value)))}
                  className="px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-xs font-mono"
                />
              </div>

              <button
                onClick={handleExecuteStrategy}
                className="mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Execute Payment with Strategy
              </button>
            </div>

            {/* Architecture State Visualization */}
            <div className="flex flex-col gap-3 p-4 rounded-md bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 flex items-center gap-1.5 text-2xs">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  RUNTIME CONTEXT &amp; CONSOLE OUTPUT
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  Active: {strategyType.toUpperCase()}
                </span>
              </div>

              <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] leading-relaxed text-zinc-300">
                <span className="text-zinc-500">// Context delegates dynamically:</span>
                <br />
                <span className="text-purple-400">cart</span>.<span className="text-blue-400">setPaymentStrategy</span>(
                <span className="text-amber-300">new {strategyType === "upi" ? "UpiStrategy" : strategyType === "cc" ? "CreditCardStrategy" : strategyType === "paypal" ? "PayPalStrategy" : "CryptoStrategy"}()</span>);
                <br />
                <span className="text-purple-400">cart</span>.<span className="text-blue-400">checkout</span>({orderAmount});
              </div>

              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-36 pt-2 text-[11px] text-zinc-300 font-mono">
                {strategyLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. OBSERVER SIMULATOR                                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {pattern.interactiveType === "observer" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Publisher & Event */}
            <div className="flex flex-col gap-4 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                1. Configure Observers (Subscribers):
              </span>
              <div className="flex flex-col gap-2">
                {observers.map((obs) => (
                  <label
                    key={obs.id}
                    className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                  >
                    <span className="text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                      {obs.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={obs.active}
                      onChange={(e) => {
                        setObservers((prev) =>
                          prev.map((o) => (o.id === obs.id ? { ...o, active: e.target.checked } : o))
                        );
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                ))}
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-2xs text-zinc-500">Select Event to Emit:</span>
                <select
                  value={observerEvent}
                  onChange={(e) => setObserverEvent(e.target.value)}
                  className="px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-xs font-mono"
                >
                  <option value="OrderCreated">OrderCreated (ID: #ord-9481)</option>
                  <option value="PaymentFailed">PaymentFailed (Code: 503 Gateway Timeout)</option>
                  <option value="ShipmentDelivered">ShipmentDelivered (Courier: FedEx)</option>
                </select>
              </div>

              <button
                onClick={handleBroadcastEvent}
                className="mt-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Publish Event to All Observers
              </button>
            </div>

            {/* Broadcast Graph & Console */}
            <div className="flex flex-col gap-3 p-4 rounded-md bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 flex items-center gap-1.5 text-2xs">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  EVENT BUS DISPATCH LOGS
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {observers.filter((o) => o.active).length} Active Observers
                </span>
              </div>

              {observerLogs.length === 0 ? (
                <div className="text-zinc-500 text-xs italic py-8 text-center">
                  Click &ldquo;Publish Event&rdquo; to watch the subject notify all active subscribers.
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2 text-[11px] font-mono">
                  {observerLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded ${
                        log.startsWith("📢")
                          ? "bg-purple-950/40 text-purple-300 border border-purple-900"
                          : "bg-zinc-900 text-emerald-300 border border-zinc-800"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. BUILDER SIMULATOR                                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      {pattern.interactiveType === "builder" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Builder Configuration Controls */}
            <div className="flex flex-col gap-4 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Configure Complex Object Step-by-Step:
              </span>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-2xs text-zinc-500 block mb-1">RAM Capacity:</label>
                  <div className="flex items-center gap-2">
                    {[16, 32, 64].map((gb) => (
                      <button
                        key={gb}
                        onClick={() => setBuilderConfig((prev) => ({ ...prev, ramGb: gb }))}
                        className={`px-3 py-1.5 rounded text-xs border ${
                          builderConfig.ramGb === gb
                            ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-bold border-zinc-900 dark:border-zinc-100"
                            : "bg-white dark:bg-[#18181b] border-zinc-300 dark:border-zinc-700"
                        }`}
                      >
                        {gb} GB
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-2xs text-zinc-500 block mb-1">Graphics Card (GPU):</label>
                  <select
                    value={builderConfig.gpu}
                    onChange={(e) => setBuilderConfig((prev) => ({ ...prev, gpu: e.target.value }))}
                    className="w-full px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-xs font-mono"
                  >
                    <option value="NVIDIA RTX 4090 (24GB)">NVIDIA RTX 4090 (24GB)</option>
                    <option value="NVIDIA RTX 4070 (12GB)">NVIDIA RTX 4070 (12GB)</option>
                    <option value="Integrated Graphics">Integrated Graphics</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs">Liquid Cooling System:</span>
                  <input
                    type="checkbox"
                    checked={builderConfig.liquidCooling}
                    onChange={(e) =>
                      setBuilderConfig((prev) => ({ ...prev, liquidCooling: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs">Wi-Fi 7 Module:</span>
                  <input
                    type="checkbox"
                    checked={builderConfig.wifi}
                    onChange={(e) =>
                      setBuilderConfig((prev) => ({ ...prev, wifi: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Generated Fluent Builder Code */}
            <div className="flex flex-col gap-3 p-4 rounded-md bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 flex items-center gap-1.5 text-2xs">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  GENERATED FLUENT BUILDER CODE
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Immutable Result</span>
              </div>

              <pre className="p-3 rounded bg-[#0c0d0e] border border-zinc-800 text-[11px] leading-relaxed text-emerald-300 overflow-x-auto">
                <code>{`Computer pc = new Computer.Builder("${builderConfig.cpu}", ${builderConfig.ramGb})
    .gpu("${builderConfig.gpu}")
    .liquidCooling(${builderConfig.liquidCooling})
    .wifi(${builderConfig.wifi})
    .build(); // Validates invariants atomically!`}</code>
              </pre>

              <div className="p-3 rounded bg-zinc-900 border border-zinc-800 text-2xs text-zinc-300 flex flex-col gap-1">
                <span className="font-bold text-zinc-100 uppercase tracking-wider">
                  Constructed Object Inspection:
                </span>
                <span>• CPU: {builderConfig.cpu}</span>
                <span>• Memory: {builderConfig.ramGb}GB DDR5</span>
                <span>• GPU: {builderConfig.gpu}</span>
                <span>• Cooling: {builderConfig.liquidCooling ? "Custom Liquid Loop" : "Standard Air Fans"}</span>
                <span>• Networking: {builderConfig.wifi ? "Wi-Fi 7 + 10GbE LAN" : "Ethernet Only"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. DECORATOR SIMULATOR                                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      {pattern.interactiveType === "decorator" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Decorator Layer Options */}
            <div className="flex flex-col gap-4 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                1. Select Base Component:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setBaseDrink("espresso")}
                  className={`flex-1 py-2 rounded text-xs border ${
                    baseDrink === "espresso"
                      ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-bold"
                      : "bg-white dark:bg-[#18181b] border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  Espresso ($2.50)
                </button>
                <button
                  onClick={() => setBaseDrink("coldbrew")}
                  className={`flex-1 py-2 rounded text-xs border ${
                    baseDrink === "coldbrew"
                      ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-bold"
                      : "bg-white dark:bg-[#18181b] border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  Cold Brew ($3.25)
                </button>
              </div>

              <span className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mt-2">
                2. Wrap with Dynamic Decorators:
              </span>
              <div className="flex flex-col gap-2">
                {[
                  { id: "milk", label: "+ Steamed Oat Milk (+$0.50)" },
                  { id: "caramel", label: "+ Sweet Caramel Drizzle (+$0.75)" },
                  { id: "whip", label: "+ Whipped Cream (+$0.60)" },
                  { id: "vanilla", label: "+ Madagascar Vanilla Syrup (+$0.40)" },
                ].map((dec) => {
                  const active = decorators.includes(dec.id);
                  return (
                    <button
                      key={dec.id}
                      onClick={() => {
                        setDecorators((prev) =>
                          active ? prev.filter((d) => d !== dec.id) : [...prev, dec.id]
                        );
                      }}
                      className={`p-2.5 rounded text-left text-xs border transition-colors flex items-center justify-between cursor-pointer ${
                        active
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-semibold"
                          : "bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <span>{dec.label}</span>
                      {active ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Plus className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Decorator Stack Visualization */}
            <div className="flex flex-col gap-3 p-4 rounded-md bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 flex items-center gap-1.5 text-2xs">
                  <Coffee className="w-3 h-3 text-emerald-400" />
                  DYNAMIC DECORATOR WRAPPER STACK
                </span>
                <span className="text-xs text-emerald-400 font-bold">Total: ${getDrinkPrice()}</span>
              </div>

              <div className="p-3 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                <span className="text-zinc-500 font-bold block mb-1">Active Object Wrapping:</span>
                <p className="text-amber-300 font-semibold leading-relaxed">
                  {getDrinkDescription()}
                </p>
              </div>

              <div className="p-3 rounded bg-[#0c0d0e] border border-zinc-800 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                <span className="text-zinc-500">// Recursive Decorator Composition:</span>
                <br />
                Beverage drink = new {baseDrink === "espresso" ? "Espresso()" : "ColdBrew()"};
                {decorators.map((d) => (
                  <div key={d} className="pl-2">
                    drink = new {d === "milk" ? "MilkDecorator" : d === "caramel" ? "CaramelDecorator" : d === "whip" ? "WhipDecorator" : "VanillaDecorator"}(drink);
                  </div>
                ))}
                System.out.println(drink.getCost()); // $
                {getDrinkPrice()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. CHAIN OF RESPONSIBILITY SIMULATOR                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      {pattern.interactiveType === "chain" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Middleware Handler Toggles */}
            <div className="flex flex-col gap-4 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Configure Chain Handlers (Toggle Failures):
              </span>

              <div className="flex flex-col gap-2.5">
                <label className="flex items-center justify-between p-3 rounded bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                  <div>
                    <span className="font-bold block">1. Authentication Check</span>
                    <span className="text-2xs text-zinc-500">Verifies Bearer JWT Header</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={chainSteps.authPassed}
                    onChange={(e) => setChainSteps((p) => ({ ...p, authPassed: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                  <div>
                    <span className="font-bold block">2. Rate Limiting Check</span>
                    <span className="text-2xs text-zinc-500">Sliding window bucket &lt; 100 req/min</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={chainSteps.rateLimitPassed}
                    onChange={(e) =>
                      setChainSteps((p) => ({ ...p, rateLimitPassed: e.target.checked }))
                    }
                    className="w-4 h-4 text-emerald-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                  <div>
                    <span className="font-bold block">3. Payload Schema Guard</span>
                    <span className="text-2xs text-zinc-500">JSON bounds &amp; size &lt; 10MB</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={chainSteps.payloadValid}
                    onChange={(e) =>
                      setChainSteps((p) => ({ ...p, payloadValid: e.target.checked }))
                    }
                    className="w-4 h-4 text-emerald-600"
                  />
                </label>
              </div>

              <button
                onClick={handleRunChain}
                className="mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Dispatch HTTP Request Through Chain
              </button>
            </div>

            {/* Pipeline Execution Display */}
            <div className="flex flex-col gap-3 p-4 rounded-md bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 flex items-center gap-1.5 text-2xs">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  CHAIN PIPELINE STATUS
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <div
                  className={`p-2.5 rounded border ${
                    chainSteps.authPassed
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                      : "bg-rose-950/40 border-rose-800 text-rose-300"
                  }`}
                >
                  Step 1: AuthHandler.check() -&gt; {chainSteps.authPassed ? "PASSED" : "FAILED (401)"}
                </div>

                <div
                  className={`p-2.5 rounded border ${
                    !chainSteps.authPassed
                      ? "opacity-40 border-zinc-800"
                      : chainSteps.rateLimitPassed
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                      : "bg-rose-950/40 border-rose-800 text-rose-300"
                  }`}
                >
                  Step 2: RateLimitHandler.check() -&gt;{" "}
                  {!chainSteps.authPassed ? "SKIPPED" : chainSteps.rateLimitPassed ? "PASSED" : "FAILED (429)"}
                </div>

                <div
                  className={`p-2.5 rounded border ${
                    !chainSteps.authPassed || !chainSteps.rateLimitPassed
                      ? "opacity-40 border-zinc-800"
                      : chainSteps.payloadValid
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                      : "bg-rose-950/40 border-rose-800 text-rose-300"
                  }`}
                >
                  Step 3: PayloadGuard.check() -&gt;{" "}
                  {!chainSteps.authPassed || !chainSteps.rateLimitPassed
                    ? "SKIPPED"
                    : chainSteps.payloadValid
                    ? "PASSED"
                    : "FAILED (422)"}
                </div>
              </div>

              {chainResult && (
                <div className="mt-3 p-3 rounded bg-zinc-900 border border-zinc-700 text-xs font-semibold">
                  {chainResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 6. STATE PATTERN SIMULATOR                                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      {pattern.interactiveType === "state" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Actions */}
            <div className="flex flex-col gap-4 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  Current Document State:
                </span>
                <span
                  className={`px-2.5 py-1 rounded font-bold text-xs ${
                    docState === "PUBLISHED"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                      : docState === "MODERATION"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                      : "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {docState}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => handleStateAction("edit")}
                  className="p-2.5 rounded bg-white dark:bg-[#18181b] border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 text-xs font-bold cursor-pointer"
                >
                  ✏️ Edit Content
                </button>
                <button
                  onClick={() => handleStateAction("submit")}
                  className="p-2.5 rounded bg-white dark:bg-[#18181b] border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 text-xs font-bold cursor-pointer"
                >
                  📨 Submit for Review
                </button>
                <button
                  onClick={() => handleStateAction("publish")}
                  className="p-2.5 rounded bg-white dark:bg-[#18181b] border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 text-xs font-bold cursor-pointer"
                >
                  🚀 Approve &amp; Publish
                </button>
                <button
                  onClick={() => handleStateAction("reject")}
                  className="p-2.5 rounded bg-white dark:bg-[#18181b] border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 text-xs font-bold cursor-pointer"
                >
                  ↩️ Reject / Unpublish
                </button>
              </div>

              <div className="p-3 rounded bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700 text-2xs text-zinc-600 dark:text-zinc-400">
                <strong>State Rules Enforced:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Draft cannot publish directly (must pass Moderation).</li>
                  <li>Published document content is immutable.</li>
                  <li>State transitions are managed by State classes, not large switches.</li>
                </ul>
              </div>
            </div>

            {/* State Transition Output */}
            <div className="flex flex-col gap-3 p-4 rounded-md bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 flex items-center gap-1.5 text-2xs">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  STATE TRANSITION AUDIT LOG
                </span>
              </div>

              <div className="p-3 rounded bg-zinc-900 border border-zinc-800 text-emerald-300 text-xs leading-relaxed font-semibold">
                &gt; {stateLog}
              </div>

              <div className="p-3 rounded bg-[#0c0d0e] border border-zinc-800 text-[11px] text-zinc-300">
                <span className="text-zinc-500 font-bold block mb-1">State Machine Flow:</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className={docState === "DRAFT" ? "text-emerald-400 font-bold underline" : "text-zinc-500"}>
                    [DRAFT]
                  </span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                  <span className={docState === "MODERATION" ? "text-amber-400 font-bold underline" : "text-zinc-500"}>
                    [MODERATION]
                  </span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                  <span className={docState === "PUBLISHED" ? "text-emerald-400 font-bold underline" : "text-zinc-500"}>
                    [PUBLISHED]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 7. FACTORY / ABSTRACT FACTORY SIMULATOR                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      {pattern.interactiveType === "factory" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-4 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Switch Target Factory Platform:
              </span>
              <div className="flex gap-2">
                {[
                  { id: "mac", label: "macOS Aqua Factory" },
                  { id: "windows", label: "Windows Metro Factory" },
                  { id: "linux", label: "Linux GTK Factory" },
                ].map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setFactoryOS(plat.id as any)}
                    className={`flex-1 py-2 px-2 rounded text-xs border ${
                      factoryOS === plat.id
                        ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-bold"
                        : "bg-white dark:bg-[#18181b] border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {plat.label}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700 text-2xs text-zinc-600 dark:text-zinc-400 mt-2">
                The client code only interacts with <code>GUIFactory.createButton()</code> and{" "}
                <code>GUIFactory.createCheckbox()</code>. It never couples directly to concrete classes!
              </div>
            </div>

            {/* Rendered Factory Components Preview */}
            <div className="flex flex-col gap-3 p-4 rounded-md bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 text-2xs">CONCRETE PRODUCTS CREATED</span>
                <span className="text-emerald-400 text-xs font-bold uppercase">{factoryOS}</span>
              </div>

              <div className="flex flex-col gap-4 p-4 rounded bg-[#0c0d0e] border border-zinc-800 items-start">
                <span className="text-2xs text-zinc-500">Rendered Button:</span>
                <button
                  className={`px-4 py-2 font-mono text-xs ${
                    factoryOS === "mac"
                      ? "rounded-full bg-blue-600 text-white shadow-md font-semibold"
                      : factoryOS === "windows"
                      ? "rounded-none bg-zinc-800 text-white border border-zinc-600"
                      : "rounded-md bg-amber-600 text-white"
                  }`}
                >
                  {factoryOS === "mac" ? "macOS Rounded Pill" : factoryOS === "windows" ? "Windows Flat Button" : "Linux GTK Button"}
                </button>

                <span className="text-2xs text-zinc-500">Rendered Checkbox:</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    defaultChecked
                    className={`w-4 h-4 ${factoryOS === "mac" ? "rounded-full text-blue-600" : "rounded-none text-zinc-800"}`}
                  />
                  <span>
                    {factoryOS === "mac" ? "Aqua Accent Checkbox" : factoryOS === "windows" ? "Metro Square Checkbox" : "GTK Checkbox"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 8. SINGLETON SIMULATOR                                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      {pattern.interactiveType === "singleton" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-4 p-4 rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Multithreaded Singleton Test:
              </span>
              <p className="text-2xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Click the button below to spawn 5 concurrent simulated worker threads simultaneously calling{" "}
                <code>DatabasePool.getInstance()</code>.
              </p>

              <button
                onClick={handleSimulateThreads}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Spawn 5 Concurrent Threads
              </button>

              <div className="p-3 rounded bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-700 text-2xs text-zinc-600 dark:text-zinc-400">
                <strong>Double-Checked Locking Guard:</strong>
                <p className="mt-1">
                  Uses <code>volatile</code> to prevent JVM instruction reordering and double synchronization checks to guarantee zero race conditions during instance creation.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 rounded-md bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 text-2xs">CONCURRENT THREAD TRACE</span>
                <span className="text-emerald-400 text-xs font-bold">1 Shared Instance</span>
              </div>

              {singletonLogs.length === 0 ? (
                <div className="text-zinc-500 text-xs italic py-8 text-center">
                  Click &ldquo;Spawn 5 Concurrent Threads&rdquo; to test thread safety.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 pt-2 text-[11px]">
                  {singletonLogs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.startsWith("✅")
                          ? "text-emerald-400 font-bold pt-2 border-t border-zinc-800"
                          : "text-zinc-300"
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
