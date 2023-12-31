import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading1, Button1, Card1, OverlayForm2, Messages } from '../../../components/index'
import { enrollInGame, fetchEnrolledGames } from '../../../apiFunctionalities'
import { useDispatch, useSelector } from 'react-redux';
import { setCourseEntity } from '../../../store/courseSlice'
import { setCourseCode } from '../../../store/resultSlice'


function ParticipantHome() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const [refreshData, setRefreshData] = useState(false);

    const username = useSelector(state => state.auth.username);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [games, setGames] = useState([]);
    
    const [showEnrollGameForm,setShowEnrollGameForm] = useState(null);

    const enrollGameSubmit = async (data) => {
        // console.log("Enroll game form Data :-",data);

        enrollInGame(data,navigate,dispatch,setCourseEntity,'/enroll',setLoading,setErrors);
        setRefreshData(prev => !prev);
    }

    const enrollGameFormData = {
        inputs : [
            // Define your form inputs here
            
            { label: 'Course Code', type: 'text', placeholder: '', name: 'courseCode', required: true,  },
            // Add more input configurations as needed
        ],
        buttons : [
            // Define your form buttons here
            { type: 'submit', text: 'Enroll', style: '' },
            // Add more button configurations as needed
        ],
        title : 'Enroll Game',
        desc : "You can enroll in a game",
        formHeight : "",
        formWidth : "", // total width of the form
        formDesign : {
            start: 'justify-center', // define whether the form should appear in the start 
            cols: 2, // define how many fields should be in 1 row
        },
        errors : errors,
    }

    const overlayForm2 = (formData,setShowForm,onSubmit) => { 

        // console.log("Clicked from", onSubmit);

        return <OverlayForm2
                    onClose={() => {
                        setShowForm(null);
                        // setShowAddCourse(false);
                    }}
                    onSubmit={onSubmit}
                    formData={formData}
                />
    };

    useEffect(() => {

        fetchEnrolledGames(username,setLoading,setErrors,setGames);

    },[refreshData]);

    const createUrl = (inputString) => {
        // Convert to lowercase and replace spaces with dashes
        const urlFriendlyString = inputString.toLowerCase().replace(/\s+/g, '-');
      
        // Return the formatted URL
        return `/${urlFriendlyString}`;
    };

    const showGames = () => {
        return  <div className='w-full flex flex-wrap justify-evenly items-center'>
                    {games.map((game,index) => (
                        <div 
                        key={index} 
                        onClick={() => {
                            // console.log("Course Code clicked",game.courseCode);
                            dispatch(setCourseCode(game.courseCode))
                        }}
                        >
                            <Card1  imageSource='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEXB-pdC3jlinrQ5Y9rLgR6F_gtPgk1W0ejT-laLKGbEDsllFqvFw39r0mExvLPHnK-7w&usqp=CAU' link={createUrl(game.gameName)} title={game.gameName} bottomTitle={game.courseCode} />
                        </div>
                    ))}
                </div>
    }

    return loading ? (
        <Loading1 />
    ) : 
    (
        <div className = 'py-10 flex space-x-5 justify-evenly items-center dark:bg-gray-40  flex-wrap'>

            <div className={`w-full ${(messages.length > 0 || errors.length > 0) && 'mb-9'}`}>
                {/* Messages section */}
                {messages.length > 0 && 
                    <div className='w-full flex justify-center items-center'>
                        <Messages messages={messages} messageType='success' setMessages={setMessages} autoClose={true} />
                    </div>
                }
                
                {/* Errors section */}
                {errors.length > 0 && 
                    <div className='w-full flex justify-center items-center mt-4'>
                        <Messages messages={errors} messageType='error' setMessages={setErrors} />
                    </div>
                }
            </div>

            <div className='w-[90%] mb-4 flex flex-col justify-end items-end'>
                
                {/* Create new game button section */}
                <div className='flex flex-col justify-center items-center'>
                    {/* <p className='mb-1 text-center text-sm font-bold md:text-md'> Enroll Game </p> */}

                    <Button1
                    className="text-sm"
                    onClick={() => {

                        if(showEnrollGameForm === null)
                            setShowEnrollGameForm(true);
                    }}
                    >
                        Join a New Game
                    </Button1>
                    
                </div>

                {showEnrollGameForm && ( 
                    overlayForm2(enrollGameFormData,setShowEnrollGameForm,enrollGameSubmit)
                
                )}

            </div>

            {showGames()}

            {/* <Card1 imageSource='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEXB-pdC3jlinrQ5Y9rLgR6F_gtPgk1W0ejT-laLKGbEDsllFqvFw39r0mExvLPHnK-7w&usqp=CAU' link='/inventory-management' title='Inventory Management' />

            <Card1 imageSource='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEXB-pdC3jlinrQ5Y9rLgR6F_gtPgk1W0ejT-laLKGbEDsllFqvFw39r0mExvLPHnK-7w&usqp=CAU' link='/seating-allocation' title='Seating Allocation' /> */}
        </div>
    )
}

export default ParticipantHome
