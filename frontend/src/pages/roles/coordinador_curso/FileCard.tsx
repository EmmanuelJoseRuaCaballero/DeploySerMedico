import { useEffect, useState } from "react";

type Props = {
  name: string;
  size: number;
  onDelete: () => void;
};

export const FileCard = ({ name, size, onDelete }: Props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + Math.random() * 20, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border rounded-xl p-4 ring-1 ring-gray-300 ring-inset shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        {/* Izquierda */}
        <div className="flex items-start gap-3">
          {/* Icono */}
          <div className="w-10 h-10 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="none"
            >
              <path
                stroke="#D5D7DA"
                stroke-width="1.5"
                d="M7.75 4A3.25 3.25 0 0 1 11 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 35 39.25H11A3.25 3.25 0 0 1 7.75 36z"
              />
              <path
                stroke="#D5D7DA"
                stroke-width="1.5"
                d="M27 .5V8a4 4 0 0 0 4 4h7.5"
              />
              <rect width="33" height="16" x="1" y="18" fill="#09843B" rx="2" />
              <path
                fill="#fff"
                d="m6.312 22.727 1.467 2.479h.057l1.473-2.479h1.737l-2.22 3.637L11.096 30H9.327l-1.491-2.482h-.057L6.287 30H4.526l2.276-3.636-2.233-3.637zM12.02 30v-7.273h1.537v6.005h3.118V30zm9.619-5.181a.9.9 0 0 0-.366-.668q-.323-.238-.877-.238-.376 0-.636.107a.9.9 0 0 0-.397.288.7.7 0 0 0-.135.419.6.6 0 0 0 .081.34.9.9 0 0 0 .253.253q.16.103.369.18.21.075.447.129l.654.156q.476.106.873.284.398.177.69.437.29.259.45.61.164.353.167.807-.004.667-.34 1.157-.334.487-.967.757-.628.266-1.516.266-.881 0-1.534-.27a2.25 2.25 0 0 1-1.016-.799q-.362-.533-.38-1.317h1.488q.025.366.21.61.188.242.5.366.317.12.714.12.39 0 .678-.113a1.04 1.04 0 0 0 .452-.316.73.73 0 0 0 .16-.465q-.001-.244-.146-.412a1.1 1.1 0 0 0-.42-.284 4 4 0 0 0-.67-.213l-.792-.199q-.92-.224-1.453-.7-.532-.475-.529-1.282-.003-.66.352-1.154.359-.493.983-.77.625-.277 1.42-.277.81 0 1.414.277.608.276.945.77t.348 1.144zm4.05-2.092 1.466 2.479h.057l1.473-2.479h1.737l-2.22 3.637L30.471 30h-1.769l-1.491-2.482h-.057L25.662 30h-1.761l2.276-3.636-2.233-3.637z"
              />
            </svg>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 leading-none">
              {name}
            </p>

            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span>{(size / 1024).toFixed(0)} KB</span>

              {progress === 100 && (
                <>
                  <div className="hidden md:block h-3 w-px bg-border"></div>

                  <div className="flex items-center gap-1 text-green-600 font-medium">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Completo
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Progeso */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-end text-xs mt-1 text-gray-600">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};
