export default function CalendarLegend() {
  return (
    <div className="mt-4 space-y-1 text-sm ml-1">
      <h4 className="font-medium">Legend</h4>
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-200" />
          <span className="text-green-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-300" />
          <span className="text-gray-500">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-orange" />
          <span className="text-primary-orange">Selected</span>
        </div>
      </div>
    </div>
  );
}

