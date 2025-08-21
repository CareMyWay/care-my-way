import React from "react";
import QuizLanding from "@/components/quiz/quiz-landing";

const ShowQuiz = () => {
    return (
        <div>
            <section className="h-auto px-4 py-12 md:px-16 bg-primary-white">
                <div className="container mx-auto flex flex-col md:h-auto">
                <QuizLanding />
                </div>
            </section>
        </div>
    );
};

export default ShowQuiz;
