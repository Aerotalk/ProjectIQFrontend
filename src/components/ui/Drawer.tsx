

export default function Drawer({ isOpen, onClose, title, size = 'md', children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white dark:bg-[#181a1f] h-full shadow-xl flex flex-col ${size === 'lg' ? 'w-1/2' : 'w-1/3'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
