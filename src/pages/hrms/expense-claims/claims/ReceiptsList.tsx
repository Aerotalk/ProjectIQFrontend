

export default function ReceiptsList() {
  return (
    <div className="p-6 bg-white dark:bg-[#181a1f] h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receipts Inbox</h3>
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-md">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No receipts uploaded yet.</p>
          <button className="mt-4 px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-md text-sm">
            Upload Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
