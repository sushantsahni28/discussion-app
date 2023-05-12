var questionBoard = document.getElementById("question-form")
let questionArray = []
var currentItem, selectedQuestion

function checkRequired(){
    var subjectData = document.getElementById("subject").value.trim()
    var questionData = document.getElementById("question").value.trim()

    if(subjectData === '' || questionData === ''){
        alert("Fill out all fields before submission!!")
    }else{
        
        var item = {
            id: Date.now(),
            subject: subjectData,
            question: questionData,
            responses: [],
            favourite: false,
            upvote: 0,
            downvote: 0,
        }

        questionArray.push(item)
        Savelocal()
      
        const { singleQuestion } = createQuestion(item);
        questionBoard.append(singleQuestion)
    }

    document.getElementById("subject").value = ""
    document.getElementById("question").value = ""
}
/*<div class="question-single">
    <div class="click-me">
        <div class="question-bar">
            <p class="display-none">ID</p>
            <h2>Question</h2>
            <p>question description</p>
        </div>
        <div class="d-time">
            <label id="time">55 min ago</label>
        </div>
    </div>
    <div class="side-buttons">
        <div>
            <button class="material-icons-outlined" id="grade">grade</button>
            <button class="material-icons-outlined" id="inccount">
                arrow_circle_up
            </button> 
            <button class="material-icons-outlined" id="deccount">
                arrow_circle_down
            </button>
        </div>
        <div class="count-votes">
            <label id="upcount">0</label>
            <label id="downcount">0</label>
        </div>
    </div>     
</div> */
function createQuestion(item){
  
    var singleQuestion = document.createElement("div")
    singleQuestion.classList.add("question-single")

    var clickQuestion = document.createElement("div")
    clickQuestion.classList.add("click-me")

    var questionBar = document.createElement("div")
    questionBar.classList.add("question-bar")

    var idElement = document.createElement("p")
    idElement.classList.add("display-none")
    idElement.textContent = item.id

    var questionElement = document.createElement("h2")
    questionElement.textContent = item.subject

    var subjectElement = document.createElement("p")
    subjectElement.textContent = item.question

    questionBar.append(questionElement)
    questionBar.append(idElement)
    questionBar.append(subjectElement)

    var disTime = document.createElement("div")
    disTime.classList.add("d-time")

    var labelTime = document.createElement("label")
    labelTime.setAttribute("id","time")
    var elapsedTime = timelogic(item.id)
    labelTime.innerText = elapsedTime

    disTime.append(labelTime)

    clickQuestion.append(questionBar)
    clickQuestion.append(disTime)

    var sideDiv = document.createElement("div")
    sideDiv.classList.add("side-buttons")

    var buttonDiv = document.createElement("div")

    var gradbtn = document.createElement("button")
    if(item.favourite){
        gradbtn.classList.add("material-icons")
    }
    else{
        gradbtn.classList.add("material-icons-outlined")        //check for favourites
    }
    gradbtn.setAttribute("id","grade")
    gradbtn.innerText = "grade"

    var upbtn = document.createElement("button")
    upbtn.classList.add("material-icons-outlined")
    upbtn.innerText = "arrow_circle_up"

    var downbtn = document.createElement("button")
    downbtn.classList.add("material-icons-outlined")
    downbtn.innerText = "arrow_circle_down"

    buttonDiv.append(gradbtn)
    buttonDiv.append(upbtn)
    buttonDiv.append(downbtn)

    var countDiv = document.createElement("div")
    countDiv.classList.add("count-votes")

    var upLabel = document.createElement("label")   //check for upcount
    upLabel.setAttribute("id","upcount")
    upLabel.innerText = item.upvote

    var downLabel = document.createElement("label")     //check for downcount
    downLabel.setAttribute("id","downcount")
    downLabel.innerText = item.downvote

    countDiv.append(upLabel)
    countDiv.append(downLabel)

    sideDiv.append(buttonDiv)
    sideDiv.append(countDiv)

    singleQuestion.append(clickQuestion)
    singleQuestion.append(sideDiv)

    ///...............eventlisteners..........
    clickQuestion.addEventListener("click",() => {
        var parentDiv = clickQuestion.firstChild
        displayResponse(parentDiv)                                      
    })
    
    gradbtn.addEventListener("click",() => {
       if(gradbtn.classList.contains("material-icons-outlined")){
            item.favourite = true
            gradbtn.classList.add("material-icons")
            gradbtn.classList.remove("material-icons-outlined")
       }else{
            item.favourite = false
            gradbtn.classList.add("material-icons-outlined")
            gradbtn.classList.remove("material-icons")
       }
       Savelocal()
       Loadlocal()
    })  
    
    upbtn.addEventListener("click",() =>{
        var upcnts = upLabel.innerText
        upcnts++
        item.upvote = upcnts
        upLabel.innerText = upcnts
        Savelocal()
        Loadlocal()
    })

    downbtn.addEventListener("click",() =>{
        var downcnts = downLabel.innerText
        downcnts++
        item.downvote = downcnts
        downLabel.innerText = downcnts
        Savelocal()
        Loadlocal()
    })

    return { singleQuestion }
}
//click on a particular question
 
function displayResponse(parentDiv){                                //changes here......
    var questionForm = document.getElementById("new-question-form")
    var responseForm = document.getElementById("response-form")

    questionForm.classList.add("display-none")
    responseForm.classList.remove("display-none")
    createDiscussion(parentDiv)   
}
/* <div class="grey-bg">
    <h4>Subject</h4>
    <h6>Description</h6>
    </div> 
<button class="btn btn-primary resp-button">Resolve</button> */
function createDiscussion(parentDiv){                            //changes here..................

    var questiondisplay = document.getElementById("display-question")
    document.getElementById("display-question").innerHTML = ""

    var questionholder = document.createElement("div")
    questionholder.classList.add("grey-bg")

    var subjectholder = document.createElement("h4")
    subjectholder.innerHTML = parentDiv.firstChild.innerText

    var descholder = document.createElement("h6")
    descholder.innerHTML = parentDiv.lastChild.innerText

    var resolveBtn = document.createElement("button")
    resolveBtn.classList.add("btn")
    resolveBtn.classList.add("btn-primary")
    resolveBtn.classList.add("resp-button")
    resolveBtn.addEventListener("click",removeQuestion)
    resolveBtn.innerHTML = "Resolve"

    questionholder.append(subjectholder)
    questionholder.append(descholder)

    questiondisplay.append(questionholder)
    questiondisplay.append(resolveBtn)

    //find on question board
    selectedQuestion = parentDiv.parentElement
    //find in array
    var search = selectedQuestion.firstChild.childNodes[1].innerText
 
    for(let i=0; i<questionArray.length; i++){
        if(search == questionArray[i].id){           
            currentItem = questionArray[i]
        }
    }
    document.getElementById("display-response").innerHTML = ""
    loadResponses()
}

function createResponse(){
    var nameData = document.getElementById("name-field").value.trim()
    var commentData = document.getElementById("comment-field").value.trim()

    if(nameData === '' || commentData === ''){
        alert("Fill out all fields before submission!!")
    }else{
        
        let saveResponse = {
            name: nameData,
            comment: commentData,
            upvote: 0,
            downvote: 0,
        }
        currentItem.responses.push(saveResponse)
        Savelocal()

        createNewResponse(nameData, commentData, 0, 0)

        document.getElementById("name-field").value = ""
        document.getElementById("comment-field").value = ""
    }
}

/*<div class="grey-bg berder">
    <div class="answer-disp">
        <h4>Name</h4>
        <h6>Answer</h6>
    </div>  
    <div class="side-buttons">
        <div>
            <button class="material-icons-outlined" id="inccount">
                arrow_circle_up
            </button>
            <button class="material-icons-outlined" id="deccount">
                arrow_circle_down
            </button>
        </div>
        <div class="count-votes-resp">
            <label id="upcount">0</label>
            <label id="downcount">0</label>
        </div>
    </div>
</div> */

function createNewResponse(nameData, commentData, upData, downData){
    var responselist = document.getElementById("display-response")

        var responseDiv = document.createElement("div")
        responseDiv.classList.add("grey-bg")
        responseDiv.classList.add("berder")

        var responseholder = document.createElement("div")
        responseholder.classList.add("answer-disp")

        var nameholder = document.createElement("h4")
        nameholder.textContent = nameData

        var answerholder = document.createElement("h6")
        answerholder.textContent = commentData

        responseholder.append(nameholder)
        responseholder.append(answerholder)

        var sideDiv = document.createElement("div")
        sideDiv.classList.add("side-buttons")

        var buttonDiv = document.createElement("div")

        var upbtn = document.createElement("button")
        upbtn.classList.add("material-icons-outlined")
        upbtn.innerText = "arrow_circle_up"

        var downbtn = document.createElement("button")
        downbtn.classList.add("material-icons-outlined")
        downbtn.innerText = "arrow_circle_down"

        buttonDiv.append(upbtn)
        buttonDiv.append(downbtn)

        var countDiv = document.createElement("div")
        countDiv.classList.add("count-votes-resp")

        var upLabel = document.createElement("label")   //check for upcount
        upLabel.setAttribute("id","upcount")
        upLabel.innerText = upData

        var downLabel = document.createElement("label")     //check for downcount
        downLabel.setAttribute("id","downcount")
        downLabel.innerText = downData

        countDiv.append(upLabel)
        countDiv.append(downLabel)

        sideDiv.append(buttonDiv)
        sideDiv.append(countDiv)

        responseDiv.append(responseholder)
        responseDiv.append(sideDiv)

        responselist.append(responseDiv)

        //............eventlisteners..........
        var findresponse = currentItem.responses.find(resp => {
            return (resp.comment === commentData)
        })
        //console.log(findresponse)
        upbtn.addEventListener("click",() =>{
            var upcnts = upLabel.innerText
            upcnts++
            findresponse.upvote = upcnts
            upLabel.innerText = upcnts
            Savelocal()

            loadResponses()
        })

        downbtn.addEventListener("click",() =>{
            var downcnts = downLabel.innerText
            downcnts++
            findresponse.downvote = downcnts
            downLabel.innerText = downcnts
            Savelocal()
            loadResponses()
        })
}

function loadResponses(){
    document.getElementById("display-response").innerHTML = ""

    var remaining = currentItem.responses.sort(order).reverse() 

    remaining.map(item => {
        createNewResponse(item.name, item.comment, item.upvote, item.downvote)
    })
}

//button functionality
function newQuestion(){
    var quesForm = document.getElementById("new-question-form")
    quesForm.classList.remove("display-none")
    var respForm = document.getElementById("response-form")
    respForm.classList.add("display-none")
}
function removeQuestion(){
    questionBoard.removeChild(selectedQuestion.parentElement)
    questionArray = questionArray.filter(item =>{
        return (item !== currentItem)
    })
    Savelocal()
    newQuestion()
}

function order(a,b){
    return (a.upvote - a.downvote) < (b.upvote - b.downvote) ? -1 : (a > b ? 1 : 0)
}

//save to localStorage
function Savelocal(){
    var createdData = JSON.stringify(questionArray)

    localStorage.setItem("savedData",createdData)
}
function Loadlocal(){
    questionBoard.innerHTML = ""
    var loadedData = localStorage.getItem("savedData")

    if(loadedData){
        questionArray = JSON.parse(loadedData)
        
        questionArray.map(item => {
            if(item.favourite === true){
                const { singleQuestion } = createQuestion(item);
                questionBoard.append(singleQuestion)
            } 
        })

        var remaining = questionArray.filter(item =>{
            if(item.favourite === false){
                return item
            }
        })

        remaining = remaining.sort(order).reverse()

        remaining.map(item => {
            const { singleQuestion } = createQuestion(item);
            questionBoard.append(singleQuestion)   
        })
    }
}
Loadlocal()

function searchQuestion(){
    var count = 0
    document.getElementById("no-match").classList.add("display-none")

    var searchBar = document.getElementById("search")
    var searchStringOrg = searchBar.value
    var searchStringLow = searchStringOrg.toLowerCase()
    //console.log(searchString)

    //console.log(questionBoard.getElementsByClassName("question-single"))
    var allQuestions = questionBoard.getElementsByClassName("question-single")
    
    for(let i=0; i<allQuestions.length; i++){
        var h2Text = allQuestions[i].firstChild.firstChild.firstChild
        var superStringOrg = h2Text.innerText
        var superStringLow = superStringOrg.toLowerCase()
        //console.log(superStringOrg)

        if(!superStringLow.includes(searchStringLow)){
            allQuestions[i].classList.add("display-none")
        }else{
            allQuestions[i].classList.remove("display-none")
            
            h2Text.innerText = ""
            
            var index = superStringLow.indexOf(searchStringLow)
            var beforespan = superStringOrg.slice(0,index)
           

            var highlightedText = superStringOrg.slice(beforespan.length,beforespan.length+searchStringOrg.length)
            var highlight = document.createElement("span")
            highlight.style = "background-color:#ddd"
            highlight.innerText = highlightedText
            
            var length = beforespan.length + searchStringOrg.length
            var afterspan = superStringOrg.slice(length)
            
            if(beforespan != ""){
                h2Text.innerText += beforespan
            }
            h2Text.append(highlight)
            var lasttext = document.createTextNode(afterspan)
            h2Text.appendChild(lasttext)
            
            //console.log(h2Text.innerText)
            count++
        }
    }
    if(count==0){
        document.getElementById("no-match").classList.remove("display-none")
    }
}

function timelogic(savedtime){
    let elapsedTime = Date.now() - savedtime
    //console.log(elapsedTime)
    let curtime = parseInt(elapsedTime/1000)
    
    if( curtime / 86400 > 1){
        return `${parseInt(curtime/86400)} days ago`
    }
    else if( curtime / 3600 > 1){
        return `${parseInt(curtime/3600)} hours ago`
    }
    else if(curtime / 60 >=1){
        return `${parseInt(curtime/60)} minutes ago`
        //console.log( parseInt(curtime/60) + " minutes ago")
    }
    else if(curtime > 10){
        return `${parseInt(curtime)} seconds ago`
    }
    else{
        return `few seconds ago`
    }   
}
function updateTime(){
    var allQuestions = questionBoard.getElementsByClassName("question-single")
    for(let i=0; i<allQuestions.length; i++){
        var createdtime = allQuestions[i].firstChild.firstChild.childNodes[1]
        var timeData = allQuestions[i].firstChild.childNodes[1].firstChild
        
        let elapsedTime = Date.now() - createdtime.innerText
        let curtime = parseInt(elapsedTime/1000)

        if( curtime / 86400 > 1){
            timeData.innerText = `${parseInt(curtime/86400)} days ago`
        }
        else if( curtime / 3600 > 1){
            timeData.innerText =  `${parseInt(curtime/3600)} hours ago`
        }
        else if(curtime / 60 >=1){
            timeData.innerText = `${parseInt(curtime/60)} minutes ago`
            //console.log( parseInt(curtime/60) + " minutes ago")
        }
        else if(curtime > 10){
            timeData.innerText = `${parseInt(curtime)} seconds ago`
        }else{
            timeData.innerText = `few seconds ago`
        }            
    }
}
setInterval(function(){
    updateTime()
},1000)
