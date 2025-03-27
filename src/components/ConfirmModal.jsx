const ConfirmModal = ({ children, modal }) => {
  if (!modal) return null;
  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        {children}
      </div>
    </div>
  );
};
export default ConfirmModal;