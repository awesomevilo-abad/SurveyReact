import PageComponent from "../components/PageComponent";
import { userStateContext } from "../context/ContextProvider";
import SurveyListItem from "../components/SurveyListItem";

export default function Surveys(){

    const {surveys} =   userStateContext();
    const onDeleteClick = () => {
        console.log('delete click')
    }

    return (
            <PageComponent title="Surveys">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {surveys.map((survey) => (
                        <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onDeleteClick}/>
                    ))}

                </div>

            </PageComponent>
    )
}