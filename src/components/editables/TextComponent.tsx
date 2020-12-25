interface Iprops {
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  rich?: boolean;
}

const TextComponent = ({ value, onChange, multiline, rich }: Iprops) => {
  if (multiline) {
    return (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} />
    );
  }

  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
};

export default TextComponent;
