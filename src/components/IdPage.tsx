import "../App.css";

export function IdPage() {
  return (
    <div className="p-4">
      <div className="w-[384px] h-[192px] bg-transparent border-2 border-white rounded-lg shadow-md flex flex-col">
        <div className="flex justify-end pr-4 pt-2">
          <p className="text-white text-lg font-semibold">Student ID</p>
        </div>
        <div className="flex items-center justify-start flex-1">
          <div className="ml-4 flex flex-col items-center">
            <div className="w-24 h-24 border-2 border-white bg-transparent flex items-center justify-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="absolute top-7 left-1/2 -translate-x-1/2 w-12 h-6 bg-gray-300 rounded-t-full"></div>
              </div>
            </div>
          </div>
          <div className="ml-6 text-white text-left">
            <p className="text-lg font-semibold mb-1">Name</p>
            <p className="text-lg font-semibold mb-1">XXXXXXXX</p>
            <p className="text-lg font-semibold">Earth Sciences</p>
          </div>
        </div>
      </div>
    </div>
  );
}
