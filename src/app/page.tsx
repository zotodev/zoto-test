import { TaskCreatePage } from "./components/TaskCreatePage";

export default function TestPage() {
  return <TaskCreatePage />;
}

// import { useState } from "react";
// import DraftForm from "./forms/DraftForm";
// import ReviewForm from "./forms/ReviewForm";

// export default function MainController() {
//   const [status, setStatus] = useState("Draft");

//   const renderForm = () => {
//     switch (status) {
//       case "Draft":
//         return <DraftForm key="Draft" currentStatus={status} onStatusChange={setStatus} />;
//       case "Review":
//         return <ReviewForm key="Review" currentStatus={status} onStatusChange={setStatus} />;
//       default:
//         return <div>Form Complete</div>;
//     }
//   };

//   return (
//     <div style={{ border: "1px solid #ccc", padding: "20px" }}>
//       <h3>Current Application Status: {status}</h3>
//       {renderForm()}
//     </div>
//   );
// }
