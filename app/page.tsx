// app/page.tsx
export default function HomePage() {
  return (
    <div className="text-center py-10 flex flex-col items-center justify-center flex-grow">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-500 mb-4">
        Welcome to Bitcoin Value Catalyst
      </h1>
      <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl">
        Share your vision on how to add the most value to Bitcoin.
        Energize ideas with satoshis. Let's build the future, together.
      </p>
      
      {/* Placeholders for Form and Bubbles will go here later */}
      <div className="w-full max-w-4xl my-8 p-2">
        {/* <p className="text-gray-400">[Idea Submission Form / Dropdown will go here]</p> */}
      </div>
      <div className="w-full max-w-6xl my-8 p-2 flex-grow min-h-[400px] sm:min-h-[500px]">
        {/* <p className="text-gray-400">[Idea Bubbles will go here]</p> */}
      </div>
    </div>
  );
}