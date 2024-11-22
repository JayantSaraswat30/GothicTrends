// app/orders/loading.tsx
export default function Loading() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {[1, 2].map((j) => (
                      <div key={j} className="flex items-center space-x-4">
                        <div className="h-24 w-24 bg-gray-200 rounded-md"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 w-48 bg-gray-200 rounded"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }