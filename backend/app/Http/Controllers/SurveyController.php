<?php

namespace App\Http\Controllers;

use App\Enums\QuestionTypeEnum;
use App\Http\Requests\SurveyStoreRequest;
use App\Http\Requests\SurveyUpdateRequest;
use App\Http\Resources\SurveyResource;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return SurveyResource::collection(
                Survey::where('user_id',$user->id)
                ->orderBy('created_at','desc')
                ->pagination(10)
            );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SurveyStoreRequest $request)
    {
        $data = $request->validated();

        if(isset($data['image'])){
            $relativePath = $this->saveImage($data['image']);
            $data['image']  = $relativePath;
        }

        $survey = Survey::create($data);

        // Create Questions
        foreach($data['questions'] as $question){
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }

        return new SurveyResource($survey);

    }

    /**
     * Display the specified resource.
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();

        if($user->id !== $survey->user_id){
            return abort(403, 'Unauthorized Action');
        }

        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SurveyUpdateRequest $request, Survey $survey)
    {
        $data = $request->validated();

        // Check if Image was given and save on local file system
        if( isset($data['image'])){
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            // if there is an old image, delete it
            if($survey->image){
                $absolutePath = public_path($survey->image);
                File::delete($absolutePath);
            }

            // Update Survey database
            $survey->update($data);

            // Get IDs as plan array of existing questions
            $existingIds = $survey->questions()->pluck('id')->toArray();

            // Get Ids as plain array of new questions
            $newIds = Arr::pluck($data['questions'],'id');

            // Find questions to delete
            $toDelete = array_diff($existingIds, $newIds);
            // Find questions to add
            $toAdd = array_diff($newIds,$existingIds);

            // Delete Questions by $toDelete Array
            SurveyQuestion::destroy($toDelete);

            // Create New Questions
            foreach ($data['questions'] as $question) {
                if (in_array($question['id'], $toAdd)){
                    $question['survey_id'] = $survey->id;
                    $this->createQuestion($question);
                }
            }

            // Update Existing Questiosn
            $questionMap = collect($data['questions'])->keyBy('id');
            foreach ($survey->questions as $question){
                if(isset($questionMap[$question->id])){
                    $this->updateQuestion($question, $questionMap[$question->id]);
                }
            }

            return new SurveyResource($survey);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();

        if($user->id  !== $survey->user_id){
            return abort(403, 'Unauthorized Action');
        }

        $survey->delete();

        // delete old image
        if ($survey->image){
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }

        return response('',204);
    }

    /**
     * Save Image in Local file System and Return save image path
     * @param $image
     * @throws \Exception
     * @author Vincent Louie Abad <abadvincentlouie@gmail.com>
     */

     private function saveImage($image)
     {
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)){
            // Take out base64 encoded string without mime type
            $image = substr($image, strpos($image,',') + 1);
            // Get File extension
            $type = strtolower($type[1]);

            // Check if file is an image
            if (!in_array($type,['jpg','jpeg','gif','png'])){
                throw new \Exception('Invalid Image Type');
            }

            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if($image === false)
            {
                throw new \Exception('base64 decode failed!');
            }
        }
        else{
            throw new \Exception('Did not match data URI with image data');
        }

        $dir = "images/";
        $file =  Str::random().'.'.$type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if(!File::exists($absolutePath)){
            File::makeDirectory($absolutePath,0755,true);
        }

        file_put_contents($relativePath,$image);
        return $relativePath;

     }

     public function createQuestion($data)
     {
        if(is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type'  => ['required',
                        new Enum(QuestionTypeEnum::class)
                        ],
            'description' => 'nullable|string',
            'data' => 'present',
            'survey_id' => 'exists:surveys,id'
        ]);
        
        return SurveyQuestion::create($validator->validated());
     }


     private function updateQuestion (SurveyQuestion $question, $data) 
     {
        if(is_array($data)){
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make($data,[
            'id'    =>  'exists:survey_questions,id',
            'question'    =>  'required|string',
            'type'    =>  ['required', new Enum(QuestionTypeEnum::class)],
            'description'    =>  'nullable|string',
            'data'  => 'present'
        ]);

        return $question->update($validator->validated());
     }

}
