import "./styles/dropdown-round.css";

interface IDropdown {
  label: string;
  value: string | number;
}

interface DropdownRoundProps {
  title: string;
  currency: IDropdown[];
  payment: IDropdown[];

}

export default function DropdownRound({ title, currency, payment }: DropdownRoundProps) {
  return (
    <div className="dropdown">
      <ul className="flex-col">
        <span id="sub-title">{title}</span>
        {currency.map((c) => (
          <li key={c.value}>{c.label}</li>
        ))}

        <span className="divider-span black" />
        <span id="sub-title">{title}</span>
        {payment.map((p) => (
          <li key={p.value}>{p.label}</li>
        ))}
      </ul>
    </div>
  );
}
