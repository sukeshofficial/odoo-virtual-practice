
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

import {
  createinput,
  checkinput,
} from "../../redux/Slices/inputslice";

function Justinput() {
  const dispatch = useDispatch();

  const { inputs, loading, error, success } = useSelector(
    (state) => state.input
  );

  const [name, setName] = useState("");

  // GET API: Fetch all names when component loads
  useEffect(() => {
    dispatch(checkinput());
  }, [dispatch]);

  // POST API: Create a new name
  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      await dispatch(createinput(name.trim())).unwrap();
      setName("");

      // Refresh list using GET API
      dispatch(checkinput());
    } catch (err) {
      console.error("Failed to create input:", err);
    }
  };

  return (
    <div className="p-4">
      <Input
        placeholder="Enter text"
        className="w-[200px] h-[40px] mt-4 ml-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Button
        variant="outline"
        onClick={handleSubmit}
        disabled={loading}
        className="w-[150px] h-10 font-medium transition-all shadow-xs ml-4 bg-black text-white"
      >
        {loading ? "Saving..." : "Click"}
      </Button>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {success && (
        <p className="mt-2 text-sm text-green-600">
          Input created successfully!
        </p>
      )}

      {/* GET API: Render saved names */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Saved Names</h2>

        {loading && <p>Loading names...</p>}

        {!loading && inputs.length === 0 && (
          <p className="mt-2 text-gray-500">No names found.</p>
        )}

        <ul className="mt-3 space-y-2">
          {inputs.map((item) => (
            <li
              key={item._id || item.id}
              className="rounded-md border p-3"
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Justinput;
