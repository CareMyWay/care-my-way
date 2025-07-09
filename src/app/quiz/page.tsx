import React from "react";
import QuestionFrame from "@/components/quiz/question-frame";
import Navbar from "@/components/nav-bars/navbar";

const ShowQuiz = () => {
  return (
    <div>
      <Navbar />
      <section className="h-auto px-4 py-12 md:px-16 bg-primary-white">
        <div className="container mx-auto flex flex-col md:h-auto">
          <QuestionFrame />
        </div>
      </section>
    </div>

  );
};

export default ShowQuiz;
