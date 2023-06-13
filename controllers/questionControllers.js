const Question   = require("../models/question.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'NEWTONSCHOOL';

const createQuestion = async (req, res) => {

    const { questionName, topic, rating, link, status, token } = req.body;
    try{
        if(!token){
            res.status(401).json({
                status: 'fail',
                message: 'Missing token'
            });
        }
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, JWT_SECRET);
        }catch(err){
            res.status(401).json({
                status: 'fail',
                message: 'Invalid token'
            });
        }
        const newQuestion = {
            questionName,
            topic,
            rating,
            link,
            status,
            creatorId: decodedToken.userId,
        };
        const question = await Question.create(newQuestion);
        res.status(200).json({
        message: 'Question added successfully to questionBank',
            questionId: question._id,
            status: 'success'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

/*

request.body = { 
    token 
}

the token here is a JWT token.

1. Return an array of question object belong to login user based on filter.
3. login user id is "userId" in payload that we get from the JWT token.

you need to modify the code to use filter.

you can get query of type topic, status.
they may or may not be given.

if you are given topic = searCh than return all the question that contain searCh as a substring. (Case Insensetive)
if you are given status = pending than return all the question those status is pending.
if you are given status = pending & topic = searCh than return all the question those status is pending and contain searCh as a substring(Case Insensetive).
if you are given range = 5-10 than return all question whose range is from [5, 10]
if its given range = 6 than return all question whose range is [6, inf)

range value can go from 0-10

Response :

1. Missing token 

401 Status Code

json = 
{
    status: 'fail',
    message: 'Missing token'
}

2. Invalid token

401 Status Code

json = 
{
    status: 'fail',
    message: 'Invalid token'
}

3. Success

200 Status Code

json = 
{
    status: 'success',
    questions : [
        {
            questionName,
            topic,
            rating,
            link,
            status,
            creatorId
        }
    ]
}

4. Fail to do

500 Status Code
json = 
{
    status: 'fail',
    message: error message
}

*/

const getQuestion = async (req, res) => {

    const token = req.body.token;
    const {topic, status, range} = req.query;
    try{
        if(!token){
            res.status(401).json({
                status: 'fail',
                message: 'Missing token'
            });
        }
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, JWT_SECRET);
        }catch(err){
            res.status(401).json({
                status: 'fail',
                message: 'Invalid token'
            });
        }
        //Write your code here.
        
        res.status(200).json({
            questions,
            status: 'success'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const deleteQuestion = async (req, res) => {

    try{
        const questiontId = req.params.id;
        const question = await Question.findById(questiontId);
        if(!question)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Question doesn't exist"
            })
        }
        await Question.findByIdAndDelete(questiontId);
        res.status(200).json({
            status: 'success',
            message: 'Question deleted successfully'
        })
        
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

const updateQuestion = async (req, res) => {

    const questiontId = req.params.id;
    const { questionName, topic, rating, link, status, token } = req.body;

    try{
        const question = await Question.findById(questiontId);
        if(!question)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Question doesn't exist"
            })
        }
        const obj = {};
        if(questionName) obj['questionName'] = questionName;
        if(topic) obj['topic'] = topic;
        if(rating) obj['rating'] = rating;
        if(link) obj['link'] = link;
        if(status) obj['status'] = status;

        await Question.findByIdAndUpdate(questiontId, obj);
        res.status(200).json({
            status: 'success',
            message: 'Question updated successfully'
        });
    } catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    };

}

module.exports = { createQuestion, getQuestion, deleteQuestion, updateQuestion };
