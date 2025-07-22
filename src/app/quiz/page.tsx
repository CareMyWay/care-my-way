import React from "react";
import QuestionFrame from "@/components/quiz/question-frame";
import Navbar from "@/components/nav-bars/navbar";
import { getCurrentUserServer } from "@/utils/amplify-server-utils";

const ShowQuiz = async () => {
  const currentUser = await getCurrentUserServer();

  if (!currentUser) {
    return <div className="h-2/3 flex items-center justify-center">Error loading quiz data -1</div>;
  }

  const currUserId = currentUser.userId;

  if (!currUserId) {
    return <div className="h-2/3 flex items-center justify-center">Error loading quiz data -2</div>;
  }



  return (
    <div>
      <Navbar />
      <section className="h-auto px-4 py-12 md:px-16 bg-primary-white">
        <div className="container mx-auto flex flex-col md:h-auto">
          <QuestionFrame currUserId={currUserId} />
        </div>
      </section>
    </div>

  );
};

export default ShowQuiz;
