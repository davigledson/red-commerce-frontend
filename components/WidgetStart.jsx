export default function WidgetStart({ title, value, icon, bgColor = 'bg-blue-100', iconColor = 'text-blue-600' }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <div className="flex items-center">
        <div className={`w-16 h-16 ${bgColor} rounded-xl flex items-center justify-center`}>
          <div className={`w-8 h-8 ${iconColor}`}>{icon}</div>
        </div>
        <div className="ml-6">
          <p className="text-base text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
