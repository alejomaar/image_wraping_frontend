import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import "./App.css";

const DraggablePoint = ({
  id,
  x = "0px",
  y = "0px",
  onMouseDown = () => {},
}) => {
  const ref = useRef(null);
  const [coordinate, setCoordinate] = useState({ x: x, y: y });

  const handleMouseDown = useCallback((event) => {
    const point = ref.current;
    point.style.position = "absolute";
    point.style.zIndex = 1000;
    const parent = ref.current.parentElement;

    function moveAt(pageX, pageY) {
      point.style.left =
        pageX - parent.offsetLeft - point.offsetWidth / 2 + "px";
      point.style.top =
        pageY - parent.offsetTop - point.offsetHeight / 2 + "px";
      //console.log(point.style.left, point.style.top, parent.offsetLeft);
      //console.log(point.style.left, point.style.top);
      //console.log(ref.current.parentElement);
      setCoordinate(() => point.style.left, point.style.top);
      onMouseDown(pageX, pageY);
    }

    moveAt(event.pageX, event.pageY);

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    point.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      point.onmouseup = null;
    };
    point.onmousedown = function () {
      document.removeEventListener("mousemove", onMouseMove);
      point.onmouseup = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className="draggable-point"
      onMouseDown={handleMouseDown}
      style={{
        width: "10px",
        height: "10px",
        backgroundColor: "red",
        left: coordinate.x,
        top: coordinate.y,
        borderRadius: "50%",
        position: "absolute",
        cursor: "pointer",
      }}
    />
  );
};

function App() {
  const [coordinates, setCoordinates] = useState([
    { x: 10, y: 10 },
    { x: 100, y: 10 },
    { x: 10, y: 100 },
    { x: 100, y: 100 },
  ]);
  const [imageUrl, setImageUrl] = useState(null);

  const postData = async () => {
    var data = JSON.stringify({
      url: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fe%2Fe2%2FA_studio_image_of_a_hand_of_playing_cards._MOD_45148377.jpg&f=1&nofb=1&ipt=982488faf2b7b347563830f58c00e7503ef6c18b387d23ae5d7bad3ab658b215&ipo=images",
      src_points: [
        [1200, 520],
        [2377, 317],
        [1541, 2365],
        [2765, 2149],
      ],
      width: 600,
      height: 800,
    });

    var config = {
      method: "post",
      url: "https://us-east1-nth-micron-411415.cloudfunctions.net/function",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg1ZTU1MTA3NDY2YjdlMjk4MzYxOTljNThjNzU4MWY1YjkyM2JlNDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA0MTYwNzc3NjQ3MjUzNTg4MTM1IiwiZW1haWwiOiJkZW1vbm1hYXJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJaZDRIa2kyQ3JOZU1MdXhVNE5yZkd3IiwibmJmIjoxNzA2NTAyNTU2LCJpYXQiOjE3MDY1MDI4NTYsImV4cCI6MTcwNjUwNjQ1NiwianRpIjoiZGI2YWQ5NTE5NmU0ODQ0NDdkY2VlMjI4MGQyNjAyM2JlNGM5NzY5MCJ9.nQODj2mcHK9NXLjF1G4C8ICjjtiOZ9C_N6pW3bD6LtGp0QWuRqv37f8hFwSeiviQo4gpCnBcaiHklI6SdvA24ZzjAIMwv5s1O7jZ8ps8NgJDXibg4iiLWcEwvSjYh7Irsz_lC7wFV6IcgSN357S15ZkIzCARiOGA5pYQ2xqEhcM2_GuT4eyJQYE9WrmbaydwXtyJU62gRdmxNfD0OYmgCiUaqjR3ICB23oOPXbWL6e3PYVin5Pltf37sxnnsf7DQENdBasGSkHz4HPskeGf-ADDdZ4jUusLnj-CA6tKwY6xyhAHJqFPhTFlQTMK7eiFdjYTJ0ApLUnKItNtv2nw5FA",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col sm:w-full md:w-7/12 lg:min-w-md mx-auto ">
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-700">
            Image Wrapping
          </h1>
        </div>
        <div className="flex flex-wrap -mx-2 mb-4">
          <input
            className="w-32 mx-2 p-2 border rounded-full text-gray-700"
            placeholder="width"
            type="text"
          />
          <input
            className="w-32 mx-2 p-2 border rounded-full text-gray-700"
            placeholder="height"
            type="text"
          />

          <button
            onClick={postData}
            className="w-full sm:w-auto px-6 py-2 mx-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none"
          >
            Process
          </button>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 p-2">
            <div className="inline-block relative">
              {/* Placeholder for image */}
              {/*               <span className="text-purple-500" style={{ zIndex: 1 }}>Image Preview</span>
               */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/45/Chatlabai.jpg"
                alt=""
                srcset=""
                className="w-80 select-none pointer-events-none"
              />
              {/* <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/45/Chatlabai.jpg"
                alt=""
                style="display: block; width: 100%; height: auto;"
              /> */}
              <DraggablePoint
                id="point1"
                x={coordinates[0].x + "px"}
                y={coordinates[0].y + "px"}
                onMouseDown={(x, y) => {
                  const coordinatesCopy = [...coordinates];
                  coordinatesCopy[0].x = x;
                  coordinatesCopy[0].y = y;
                  setCoordinates(coordinatesCopy);
                }}
              />
              <DraggablePoint
                id="point2"
                x={coordinates[1].x + "px"}
                y={coordinates[1].y + "px"}
                onMouseDown={(x, y) => {
                  const coordinatesCopy = [...coordinates];
                  coordinatesCopy[1].x = x;
                  coordinatesCopy[1].y = y;
                  setCoordinates(coordinatesCopy);
                }}
              />
              <DraggablePoint
                id="point3"
                x={coordinates[2].x + "px"}
                y={coordinates[2].y + "px"}
                onMouseDown={(x, y) => {
                  const coordinatesCopy = [...coordinates];
                  coordinatesCopy[2].x = x;
                  coordinatesCopy[2].y = y;
                  setCoordinates(coordinatesCopy);
                }}
              />
              <DraggablePoint
                id="point4"
                x={coordinates[3].x + "px"}
                y={coordinates[3].y + "px"}
                onMouseDown={(x, y) => {
                  const coordinatesCopy = [...coordinates];
                  coordinatesCopy[3].x = x;
                  coordinatesCopy[3].y = y;
                  setCoordinates(coordinatesCopy);
                }}
              />
              {/* <DraggablePoint id="point2" />
              <DraggablePoint id="point3" />
              <DraggablePoint id="point4" /> */}
            </div>
          </div>
          <div className="w-full md:w-1/2 p-2">
            <div className="bg-purple-100 rounded-lg p-4 h-48 flex justify-center items-center">
              {/* Placeholder for image */}
              {imageUrl && <img src={imageUrl} alt="Response Image" />}
            </div>
          </div>
        </div>
        <div className="flex flex-col  justify-between rounded-lg w-32 pt-1 mx-auto">
          <div className="flex w-32 bg-purple-500">
            <div className="w-1/2 text-white p-1  flex justify-center items-center">
              x
            </div>
            <div className="w-1/2 text-white p-1  flex justify-center items-center">
              y
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[0].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[0].y}
            </div>
          </div>
          <div className="flex w-32 bg-gray-100 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[1].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[1].y}
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[2].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[2].y}
            </div>
          </div>
          <div className="flex w-32 bg-gray-50 ">
            <div className="w-1/2  p-1  flex justify-center items-center ">
              {coordinates[3].x}
            </div>
            <div className="w-1/2  p-1  flex justify-center items-center">
              {coordinates[3].y}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
