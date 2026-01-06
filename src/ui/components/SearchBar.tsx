type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  onClear,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white dark:bg-gray-800 px-3 py-2 shadow-sm">
      <input
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        placeholder="Search history & bookmarks…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange(""))}
          className="rounded-lg px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
          title="Clear"
        >
          ✕
        </button>
      )}
    </div>
  );
}
