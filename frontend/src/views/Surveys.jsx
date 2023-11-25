import PageComponent from "../components/PageComponent";
import { userStateContext } from "../context/ContextProvider";
import SurveyListItem from "../components/SurveyListItem";
import TButton from "../components/core/TButton";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function Surveys(){

    const {currentUser, surveys} =   userStateContext();

    const onDeleteClick = () => {
        console.log('delete click')
    }

    return (
            <PageComponent 
                title="Surveys"
                buttons={(
                    <TButton color="green" to="/surveys/create">
                        <PlusCircleIcon className="h-6 w-6 mr-2" />
                        Create New {currentUser.name}
                    </TButton>
                )}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {surveys.map(survey => (
                            <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onDeleteClick}/>
                        ))}

                    </div>

            </PageComponent>
    )
}