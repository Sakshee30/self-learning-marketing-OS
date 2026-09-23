import { decisionReceipt } from "@/src/content/product";

export function DecisionReceipt() {
  return (
    <section className="section receipt-section">
      <div className="container receipt-layout">
        <div>
          <span className="eyebrow">Decision receipts</span>
          <h2>Trace important actions from goal to learning.</h2>
          <p>
            Consequential execution is designed to carry a durable chain of context so operators can
            understand what was proposed, what evidence supported it, who approved it, what actually
            happened, and what the system learned.
          </p>
        </div>

        <ol className="receipt-chain">
          {decisionReceipt.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
