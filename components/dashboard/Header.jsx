export default function Header({
  title,
  subtitle,
  count,
  countLabel,
  gradientFrom = "from-purple-500",
  gradientTo = "to-blue-500",
  subtitleColor = "text-purple-100",
  icon
}) {
  return (
    <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} px-10 py-10 shadow-lg`}>
      <div className="flex items-center justify-between max-w-8xl mx-auto">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2">{title}</h1>
          <p className={`${subtitleColor} text-xl`}>{subtitle}</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
            <span className="text-white font-medium text-lg">{count} {countLabel}</span>
          </div>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}