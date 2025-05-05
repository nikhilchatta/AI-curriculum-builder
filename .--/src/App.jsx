import { useState, useRef } from "react";

function App() {
  const [formData, setFormData] = useState({
    topic: "",
    pace: "Normal",
    style: [],
    depth: "Beginner",
    days: 5,
    startDate: "",
  });

  const [curriculum, setCurriculum] = useState([]);
  const curriculumRef = useRef();

  const learningStyles = ["Videos", "Articles", "Hands-on"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        style: checked
          ? [...prev.style, value]
          : prev.style.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setCurriculum(data);

    setTimeout(() => {
      document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg space-y-5"
        >
          <h1 className="text-2xl font-bold text-blue-700 text-center">AI Curriculum Builder</h1>

          <div>
            <label className="text-gray-700">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="e.g. Data Engineering"
            />
          </div>

          <div>
            <label className="text-gray-700">Learning Pace</label>
            <select
              name="pace"
              value={formData.pace}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option>Fast</option>
              <option>Normal</option>
              <option>Slow</option>
            </select>
          </div>

          <div>
            <label className="text-gray-700 block mb-1">Preferred Style</label>
            <div className="flex gap-4">
              {learningStyles.map((style) => (
                <label key={style} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="style"
                    value={style}
                    checked={formData.style.includes(style)}
                    onChange={handleChange}
                  />
                  <span>{style}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-700 block mb-1">Learning Depth</label>
            <div className="flex gap-4">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <label key={level} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="depth"
                    value={level}
                    checked={formData.depth === level}
                    onChange={handleChange}
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Generate Curriculum
          </button>
        </form>

        {/* CURRICULUM */}
        {curriculum.length > 0 && (
          <div
            id="curriculum"
            ref={curriculumRef}
            className="bg-white p-6 rounded-xl shadow-lg max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-green-700 mb-4 text-center">
              Your Personalized Curriculum
            </h2>
            {curriculum.map((item) => (
              <div key={item.day} className="mb-6 border-b pb-4">
                <h3 className="text-blue-700 font-semibold">Day {item.day}: {item.topic}</h3>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  {item.objectives?.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
                <p className="text-sm mt-2"><strong>Resources:</strong> {item.resources?.join(", ")}</p>
                <p className="text-sm"><strong>Assignment:</strong> {item.assignment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
