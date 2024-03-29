import React, { useState, useEffect } from 'react'
import { Loading1, SearchEngine, TablePagination, CardPagination, OverlayForm1, Messages } from '../../../components/index'
import { FaPencilAlt, FaInfoCircle, FaBell } from 'react-icons/fa';
import { IoMdOpen } from 'react-icons/io';
import { MdDescription } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses, updateArchive, updateAttempts, updateSchedule } from '../../../apiFunctionalities'
import { setCourseEntity } from '../../../store/courseSlice'
import { useNavigate } from 'react-router-dom';


function InstructorHome() {
    const [loading, setLoading] = useState(false);
    const [errors,setErrors] = useState([]);
    const [messages,setMessages] = useState([]);
    const [refreshData, setRefreshData] = useState(false);

    const username = useSelector(state => state.auth.username);
    const email = useSelector(state => state.auth.email);
    // const username = "";
    
    const [hoveredDetails, setHoveredDetails] = useState([]);

    const [showFormIndex1, setShowFormIndex1] = useState(null);
    const [showFormIndex2, setShowFormIndex2] = useState(null);
    const [showFormIndex3, setShowFormIndex3] = useState(null);

    const [displayFormat,setDisplayFormat] = useState('Table');

    const [filteredItems, setFilteredItems] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let animationTimeout;

    const editAttempts = async (data) => {
        
        const response = await updateAttempts(data,email,setLoading,setErrors,setMessages);
        if(response === true){
            setRefreshData(prev => !prev);
        }
    };

    const editArchive = async (data) => {
        
        const response = await updateArchive(data,email,setLoading,setErrors,setMessages);
        if(response === true){
            setRefreshData(prev => !prev);
        }
    };

    const editSchedule = async (data) => {
        
        const response = await updateSchedule(data,email,setLoading,setErrors,setMessages);
        if(response === true){
            setRefreshData(prev => !prev);
        }
    };

    const editAttemptsFormData = {
        inputs : [
            // Define your form inputs here
            { label: 'Course Code', type: 'text', placeholder: 'Course Code', name: 'courseCode', required: true, defaultValue: 'courseCode', readOnly : true },
            { label: 'No of Attempts', type: 'text', placeholder: 'Student Course Attempts', name: 'studentAttempts', required: true, defaultValue: 'attempts', },
            // Add more input configurations as needed
        ],
        buttons : [
            // Define your form buttons here
            // { type: 'text', text: 'Prev', style: 'w-full' },
            { type: 'submit', text: 'Update', style: 'bg-green-500 border-green-400 hover:bg-green-400 rounded-md' },
            // Add more button configurations as needed
        ],
        title : "Update",
        desc : "You can update with respective details",
        formHeight : "md:h-[55%]",
        // formWidth : "md:h-[90%]",
    }

    const editArchiveFormData = {
        inputs : [
            // Define your form inputs here
            { label: 'Course Code', type: 'text', placeholder: 'Course Code', name: 'courseCode', required: true, defaultValue: 'courseCode', readOnly : true },
            { label: 'Archive', type: 'select', options : ['No','Yes'], placeholder: 'Select archive option', name: 'archive', required: true, defaultValue: 'Select archive option', },
            // { label: 'Checkbox', type: 'checkbox', options : ['Yes','No'], placeholder: 'Checkbox', name: 'bad', required: true, defaultValue: 'bad' },
            // { label: 'Radio', type: 'radio', options : ['Yes','No'], placeholder: 'Radio', name: 'bad', required: true, defaultValue: 'bad' },
            // Add more input configurations as needed
        ],
        buttons : [
            // Define your form buttons here
            // { type: 'text', text: 'Prev', style: 'w-full' },
            { type: 'submit', text: 'Update', style: 'bg-green-500 border-green-400 hover:bg-green-400 rounded-md' },
            // Add more button configurations as needed
        ],
        title : "Update",
        desc : "You can update with respective details",
        formHeight : "md:h-[55%]",
        // formWidth : "md:h-[90%]",
    }

    const editScheduleFormData = {
        inputs : [
            // Define your form inputs here
            { label: 'Course Code', type: 'text', placeholder: 'Course Code', name: 'courseCode', required: true, defaultValue: 'courseCode', readOnly : true },
            { label: 'Start Time', type: 'dateAndTime2', placeholder: 'Start Time', name: 'startTime', required: true, defaultValue: 'startTime',  },
            { label: 'End Time', type: 'dateAndTime2', placeholder: 'End Time', name: 'endTime', required: true, defaultValue: 'endTime', 
            },
            // Add more input configurations as needed
        ],
        buttons : [
            // Define your form buttons here
            // { type: 'text', text: 'Prev', style: 'w-full' },
            { type: 'submit', text: 'Update', style: 'bg-green-500 border-green-400 hover:bg-green-400 rounded-md' },
            // Add more button configurations as needed
        ],
        title : "Time Schedule",
        desc : "You can update with respective details",
        formHeight : "",
        formWidth : "md:h-[80%]",
    }

    const form = (parentData,formData,setShowFormIndex,onSubmit) => { 

        // console.log("Clicked from", parentData);

        return <OverlayForm1
                    onClose={() => {
                        setShowFormIndex(null);
                    }}
                    onSubmit={onSubmit}
                    formData={formData}
                    parentData={parentData}
                />
    };

    function formatToCustomString(dateTimeString) {
        // Try to parse the input string into a Date object
        const dateObject = new Date(dateTimeString);
      
        // Check if the parsing was successful and it's a valid Date object
        if (!isNaN(dateObject.getTime())) {
            // If it's a valid Date object, return the custom formatted string
            const options = {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            return dateObject.toLocaleString('en-US', options);
        } 
        else {
          // If parsing fails, return the original input (or handle it as needed)
          return dateTimeString;
        }
    }

    // generate a unique course Code everytime create add course form appears
    const generateUniqueCourseCode = () => {
        const getRandomAlphabets = (length) => {
            const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
            }
            return result;
        };
      
        const getJumbledString = (input) => {
            return input
                .split('')
                .sort(() => Math.random() - 0.5)
                .join('');
        };
      
        const getTimestamp = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
            
            // Combine time components
            const timeString = `${hours}${minutes}${seconds}${milliseconds}`;
        
            return (timeString);
        };
      
        // Maximum length for courseCode
        const maxCodeLength = 10;
      
        // Generate at least 4 alphabets for the start of courseCode and jumble them
        const initialAlphabets = getRandomAlphabets(4);
        const jumbledInitialAlphabets = getJumbledString(initialAlphabets);
      
        // Generate jumbled timestamp
        const timestamp = getTimestamp();
      
        // Combine all parts to form the final courseCode
        let courseCode = jumbledInitialAlphabets + timestamp;
      
        // Trim alphabets if necessary to accommodate the timestamp
        if (courseCode.length > maxCodeLength) {
            const trimmedAlphabets = jumbledInitialAlphabets.substring(0, Math.max(3, jumbledInitialAlphabets.length - (courseCode.length - maxCodeLength)));
            courseCode = trimmedAlphabets + timestamp;
        }
        
        return courseCode;
    };

    const [items,setItems] = useState([
        // {
        //     courseCode : generateUniqueCourseCode(),

        //     courseName : 'Logistics Practice',
            
        //     studentRegistered : '0',

        //     attempts : '3',

        //     archive : 'No',

        //     licenses : '15',

        //     startTime : new Date('2024-01-26T13:00:00'),

        //     endTime : new Date('2024-01-26T14:00:00'),

        //     // startTime : parseDateAndTime('26/01/2024 12:00 AM'),

        //     // endTime : parseDateAndTime('26/01/2024 02:00 PM'),
        // },
        // {
        //     courseCode : generateUniqueCourseCode(),

        //     courseName : 'Nego Test',
            
        //     studentRegistered : '1',

        //     attempts : '5',

        //     archive : 'No',

        //     licenses : '2',

        //     startTime : new Date('2024-01-28T16:00:00'),

        //     endTime : new Date('2024-01-28T18:00:00'),

        //     // startTime : parseDateAndTime('28/01/2024 04:00 AM'),

        //     // endTime : parseDateAndTime('28/01/2024 06:00 PM'),
        // },
        // {
        //     courseCode : generateUniqueCourseCode(),

        //     courseName : 'Inventory Management',
            
        //     studentRegistered : '7',

        //     attempts : '5',

        //     archive : 'No',

        //     licenses : '2',

        //     startTime : new Date('2024-01-20T14:00:00'),

        //     endTime : new Date('2024-01-20T16:00:00'),

        //     // startTime : parseDateAndTime('28/01/2024 04:00 AM'),

        //     // endTime : parseDateAndTime('28/01/2024 06:00 PM'),
        // },
        // {
        //     courseCode : generateUniqueCourseCode(),

        //     courseName : 'Logistics Practice2',
            
        //     studentRegistered : '0',

        //     attempts : '3',

        //     archive : 'No',

        //     licenses : '15',

        //     startTime : new Date('2024-01-24T13:00:00'),

        //     endTime : new Date('2024-01-30T14:00:00'),

        //     // startTime : parseDateAndTime('26/01/2024 12:00 AM'),

        //     // endTime : parseDateAndTime('26/01/2024 02:00 PM'),
        // },
        // {
        //     courseCode : generateUniqueCourseCode(),

        //     courseName : 'Logistics Practice3',
            
        //     studentRegistered : '0',

        //     attempts : '3',

        //     archive : 'No',

        //     licenses : '15',

        //     startTime : new Date('2024-01-21T13:00:00'),

        //     endTime : new Date('2024-01-21T14:00:00'),

        //     // startTime : parseDateAndTime('26/01/2024 12:00 AM'),

        //     // endTime : parseDateAndTime('26/01/2024 02:00 PM'),
        // },
        // {
        //     courseCode : generateUniqueCourseCode(),

        //     courseName : 'Logistics Practice4',
            
        //     studentRegistered : '0',

        //     attempts : '3',

        //     archive : 'No',

        //     licenses : '15',

        //     startTime : new Date('2024-01-22T13:00:00'),

        //     endTime : new Date('2024-01-22T14:00:00'),

        //     // startTime : parseDateAndTime('26/01/2024 12:00 AM'),

        //     // endTime : parseDateAndTime('26/01/2024 02:00 PM'),
        // },
    ]);

    function convertIsoStringToObject(isoString) {
        // Create a new Date object from the ISO string
        const dateObject = new Date(isoString);
      
        // Check if the dateObject is valid
        if (isNaN(dateObject.getTime())) {
        //   console.error('Invalid ISO format');
          return null;
        }
      
        // Use toISOString() to get the ISO string representation
        const formattedString = dateObject.toISOString();
      
        // Extract the date and time part from the ISO string
        const desiredFormat = formattedString.slice(0, 19);
      
        // Create an array with the desired format
        const resultArray = [dateObject];
      
        return resultArray;
    }

    function convertTimeObjectToIsoString(isoString) {
        // Create a new Date object from the ISO string
        const dateObject = new Date(isoString);
      
        // Check if the dateObject is valid
        if (isNaN(dateObject.getTime())) {
        //   console.error('Invalid date format');
          return null;
        }
      
        // Use toISOString() to get the ISO string representation
        const formattedString = dateObject.toISOString();
      
        // Extract the date and time part from the ISO string
        const desiredFormat = formattedString.slice(0, 19);
      
        return desiredFormat;
    }

    // fetch all necessary details when page loads
    useEffect(() => {
        // const isoString = '2024-01-26T13:00:00';
        // console.log(convertIsoStringToObject(isoString));

        fetchAllCourses(username,setLoading,setErrors,setItems);


    }, [refreshData]);

    const tableColumnsDescription = [
        { // Course Code
            header : 'Course Code',
            dataKey: 'courseCode', 
            label: 'Course Code', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,item) => {
                        // alert('Entered')
                        setHoveredDetails([index,'Course Code','courseCode']);
                    },
                    onMouseLeave: (index,item) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index, value) => {
                return (
                  <div
                    className={`lg:cursor-help w-full h-full flex flex-wrap justify-center items-center relative ${
                      hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'courseCode'
                        ? 'z-10'
                        : 'z-1'
                    }`}
                  >
                    {hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'courseCode' && (
                        <div
                          className={`hidden lg:flex w-[10rem] justify-center items-center text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                        >
                          <div className='flex flex-col justify-center items-center'>
                            <FaInfoCircle size={16} className="text-blue-500" />
                            {hoveredDetails[1]}
                          </div>
                        </div>
                    )}
                    {value}
                  </div>
                );
            },
            dataRender: (index, value, currentItem) => {
                return  <div
                            className={`w-full h-full text-slate-500 font-bold flex flex-wrap justify-center items-center`}
                        >
                            {value}
                            
                        </div>;
            }
        },
        { // Name
            header : 'Name',
            dataKey: 'courseName', 
            label: 'Name', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,item) => {
                        // alert('Entered')
                        setHoveredDetails([index,'Name of the course','courseName']);
                    },
                    onMouseLeave: (index,item) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index, value) => {
                return (
                  <div
                    className={`lg:cursor-help w-full h-full flex flex-wrap justify-center items-center relative ${
                      hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'courseName'
                        ? 'z-10'
                        : 'z-1'
                    }`}
                  >
                    {hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'courseName' && (
                        <div
                          className={`hidden lg:flex w-[10rem] justify-center items-center text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                        >
                          <div className='flex flex-col justify-center items-center'>
                            <FaInfoCircle size={16} className="text-blue-500" />
                            {hoveredDetails[1]}
                          </div>
                        </div>
                    )}
                    {value}
                    <MdDescription />
                  </div>
                );
            },
            dataRender: (index, value, currentItem) => {
                // console.log("Current Item", currentItem);

                // const props = {
                //     courseList: JSON.stringify(currentItem.courseList),
                //     instructorName: currentItem.instructorName,
                // }

                // const queryString = Object.keys(props)
                //     .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(props[key])}`)
                //     .join('&');
                
                return  <div className='flex justify-center items-center'>
                            <div className='text-blue-700 font-bold '>
                                {value}
                            </div>

                            <div
                            onClick={() => {
                                let item = currentItem;
                                item.startTime = convertTimeObjectToIsoString(item.startTime);
                                item.endTime = convertTimeObjectToIsoString(item.endTime);
                                dispatch(setCourseEntity(item));
                                // console.log("Item", item);
                                navigate('/course/students-enrolled')
                            }}
                            className={`h-[3rem] ml-1 cursor-alias text-blue-600 font-bold flex justify-center items-center`}>

                                <IoMdOpen />
                            </div>
                            
                        </div>
            } 
        },
        { // Users
            header : 'Users',
            dataKey: 'studentRegistered', 
            label: 'Student Registered', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,item) => {
                        // alert('Entered')
                        setHoveredDetails([index,'Number of students registered in the course','studentRegistered']);
                    },
                    onMouseLeave: (index,item) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index, value) => {
                return (
                  <div
                    className={`lg:cursor-help w-full h-full flex flex-wrap justify-center items-center relative ${
                      hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'studentRegistered'
                        ? 'z-10'
                        : 'z-1'
                    }`}
                  >
                    {hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'studentRegistered' && (
                        <div
                          className={`hidden lg:flex w-[10rem] justify-center items-center text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                        >
                          <div className='flex flex-col justify-center items-center'>
                            <FaInfoCircle size={16} className="text-blue-500" />
                            {hoveredDetails[1]}
                          </div>
                        </div>
                    )}
                    {value}
                  </div>
                );
              },
              
            dataRender: (index, value, currentItem) => {
                return  <div
                            className={`w-full h-full text-lg font-bold flex text-slate-500 flex-wrap justify-center items-center`}
                        >
                            {currentItem.enrolledStudentsList ? currentItem.enrolledStudentsList.length : '0'}
                            
                        </div>;
            }
        },
        { // Attempts
            header : 'Attempts',
            dataKey: 'attempts', 
            label: 'Student Attempts', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,item) => {
                        // alert('Entered')
                        setHoveredDetails([index,'Total number of times a student can attempt the course','attempts']);
                    },
                    onMouseLeave: (index,item) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index, value) => {
                return (
                  <div
                    className={`lg:cursor-help w-full h-full flex flex-wrap justify-center items-center relative ${
                      hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'attempts'
                        ? 'z-10'
                        : 'z-1'
                    }`}
                  >
                    {hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'attempts' && (
                        <div
                          className={`hidden lg:flex w-[10rem] justify-center items-center text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                        >
                          <div className='flex flex-col justify-center items-center'>
                            <FaInfoCircle size={16} className="text-blue-500" />
                            {hoveredDetails[1]}
                          </div>
                        </div>
                    )}
                    {value}
                    <FaPencilAlt size={9} className='mb-3 ml-1' />
                  </div>
                );
            },
            rowFunctionality: {
                
                event: {
                    onClick : (index) => {
                        if(showFormIndex1 === null)
                            setShowFormIndex1(index);
                    },
                },
                action: (currentItem,index) => {
                    return showFormIndex1 === index && form(currentItem,editAttemptsFormData,setShowFormIndex1,editAttempts)
                }

            },
            dataRender: (index, value, currentItem) => {
                return <p 
                        className={`w-full h-[3rem] text-orange-400 font-bold text-lg flex justify-center items-center `}>
                            {value}
                        </p>
            } 
        },
        { // Archive
            header : 'Archive',
            dataKey: 'archive', 
            label: 'Archive', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,item) => {
                        // alert('Entered')
                        setHoveredDetails([index,'Archive this course','archive']);
                    },
                    onMouseLeave: (index,item) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index, value) => {
                return (
                  <div
                    className={`lg:cursor-help w-full h-full flex flex-wrap justify-center items-center relative ${
                      hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'archive'
                        ? 'z-10'
                        : 'z-1'
                    }`}
                  >
                    {hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'archive' && (
                        <div
                          className={`hidden lg:flex w-[10rem] justify-center items-center text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                        >
                          <div className='flex flex-col justify-center items-center'>
                            <FaInfoCircle size={16} className="text-blue-500" />
                            {hoveredDetails[1]}
                          </div>
                        </div>
                    )}
                    {value}
                    <FaPencilAlt size={9} className='mb-3 ml-1' />
                  </div>
                );
            },
            rowFunctionality: {
                
                event: {
                    onClick : (index) => {
                        if(showFormIndex2 === null)
                            setShowFormIndex2(index);
                    },
                },
                action: (currentItem,index) => {
                    return showFormIndex2 === index && form(currentItem,editArchiveFormData,setShowFormIndex2,editArchive)
                }

            },
            dataRender: (index, value, currentItem) => {
                return <p 
                        className={`w-full h-[3rem] flex text-lg font-bold text-slate-500 justify-center items-center`}>

                            {value === true ? 'Yes' : 'No'}
                        </p>
            } 
        },
        { // License Left
            header : 'Licenses',
            dataKey: 'licenses', 
            label: 'Licenses', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,item) => {
                        // alert('Entered')
                        setHoveredDetails([index,'Total number of licenses left for this course','licenses']);
                    },
                    onMouseLeave: (index,item) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index, value) => {
                return (
                  <div
                    className={`lg:cursor-help w-full h-full flex flex-wrap justify-center items-center relative ${
                      hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'licenses'
                        ? 'z-10'
                        : 'z-1'
                    }`}
                  >
                    {hoveredDetails.length > 0 &&
                      hoveredDetails[0] === index &&
                      hoveredDetails[2] === 'licenses' && (
                        <div
                          className={`hidden lg:flex w-[10rem] justify-center items-center text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                        >
                          <div className='flex flex-col justify-center items-center'>
                            <FaInfoCircle size={16} className="text-blue-500" />
                            {hoveredDetails[1]}
                          </div>
                        </div>
                    )}
                    {value}
                  </div>
                );
            },
              
            dataRender: (index, value, currentItem) => {
                return  <div
                            className={`w-full h-full font-bold text-lg text-green-600 flex flex-wrap justify-center items-center`}
                        >
                            {value}
                            
                        </div>;
            }
        },
        { // Schedule
            header : 'Schedule',
            dataKey: 'editSchedule', 
            label: 'Edit Schedule', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,item) => {
                        // alert('Entered')
                        setHoveredDetails([index,'Edit attempt schedule of the course','editSchedule']);
                    },
                    onMouseLeave: (index,item) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index,value) => {
                return <div
                            className={`lg:cursor-help w-full h-full flex flex-wrap justify-center items-center relative ${
                                hoveredDetails.length > 0 &&
                                hoveredDetails[0] === index &&
                                hoveredDetails[2] === 'editSchedule'
                                    ? 'z-10'
                                    : 'z-1'
                            }`}
                        >
                            {hoveredDetails.length > 0 &&
                            hoveredDetails[0] === index &&
                            hoveredDetails[2] === 'editSchedule' && (
                                <div
                                className={`hidden lg:flex w-[10rem]  justify-center items-center  text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                                >
                                <div className='flex flex-col justify-center items-center'>
                                    <FaInfoCircle size={16} className="text-blue-500" />
                                    {hoveredDetails[1]}
                                </div>
                                </div>
                            )}
                            {value}
                            <FaPencilAlt size={9} className='mb-3 ml-1' />
                            
                        </div>;
            },
            rowFunctionality: {
                
                event: {
                    onClick : (index) => {
                        if(showFormIndex3 === null)
                            setShowFormIndex3(index);
                    },
                },
                action: (currentItem,index) => {
                    return showFormIndex3 === index && form(currentItem,editScheduleFormData,setShowFormIndex3,editSchedule)
                }

            },
            dataRender: (index, value, currentItem) => {
                return  <div className='w-full flex flex-col justify-center items-center'>
                            <input contentEditable={false} value={formatToCustomString(currentItem.startTime)} onChange={() => {}} className='bg-[#f5f467]  pl-1 cursor-pointer outline-none flex w-[12rem] text-center h-[2rem] justify-center items-center rounded-lg' />

                            <p className='text-xs  '>
                                to
                            </p>

                            <input contentEditable={false} value={formatToCustomString(currentItem.endTime)} onChange={() => {}} className='bg-emerald-200 pl-1 cursor-pointer outline-none flex w-[12rem] text-center h-[2rem] justify-center items-center rounded-lg' />

                            <p 
                            onMouseEnter={() => handleMouseEnter([index,'editSchedule'])}
                            onMouseLeave={handleMouseLeave} 
                            className={`w-full h-[1rem] flex justify-center items-center ${hoveredDetails.length > 0 && hoveredDetails[0] === index && hoveredDetails[1] === 'editSchedule' ? ' animate-bounce' : ''}`}>

                                <FaBell size={15} className=' text-slate-700 cursor-pointer' />
                            </p>
                        </div>
            } 
        },
    ];

    // cardColumnsDescription starts here

    const cardColumnsDescription = [
        { // Course Code
            header : 'Course Code',
            dataKey: 'courseCode', 
            label: 'Course Code', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,value,currentItem) => {
                        // alert('Entered')
                        setHoveredDetails([index,currentItem.courseCode,'Course Code','courseCode']);
                    },
                    onMouseLeave: (index,value,currentItem) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index,value,currentItem) => {
                return <div
                            // onMouseEnter={() => handleMouseEnter([index,currentItem.courseCode,'editSchedulecolumn'])}
                            onMouseLeave={handleMouseLeave} 
                            className={`lg:cursor-help w-full h-full flex flex-wrap justify-start items-center relative `}
                        >
                            {hoveredDetails.length > 0 &&
                            hoveredDetails[0] === index && hoveredDetails[1] === currentItem.courseCode &&
                            hoveredDetails[3] === 'courseCode' && (
                                <div
                                className={`hidden lg:flex w-[10rem] text-center justify-center items-center  text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2  rounded shadow-md border border-gray-300 z-1001`}
                                >
                                <div className='flex flex-col justify-center items-center'>
                                    <FaInfoCircle size={16} className="text-blue-500" />
                                    {hoveredDetails[2]}
                                </div>
                                </div>
                            )}
                            {value}
                            
                        </div>;
            },
            dataRender: (index, value, currentItem) => {
                return  <div
                            className={`w-1/2 h-full text-slate-500 font-bold flex flex-wrap justify-end items-center`}
                        >
                            {value}
                            
                        </div>;
            }
        },
        { // Name
            header : 'Name',
            dataKey: 'courseName', 
            label: 'Name', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,value,currentItem) => {
                        // alert('Entered')
                        setHoveredDetails([index,currentItem.courseCode,'Name of the course','courseName']);
                    },
                    onMouseLeave: (index,value,currentItem) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index,value,currentItem) => {
                return <div
                            // onMouseEnter={() => handleMouseEnter([index,currentItem.courseCode,'editSchedulecolumn'])}
                            onMouseLeave={handleMouseLeave} 
                            className={`lg:cursor-help w-full h-full flex flex-wrap text-start justify-start items-center relative `}
                        >
                            {hoveredDetails.length > 0 &&
                            hoveredDetails[0] === index && hoveredDetails[1] === currentItem.courseCode &&
                            hoveredDetails[3] === 'courseName' && (
                                <div
                                className={`hidden lg:flex w-[10rem] text-center justify-center items-center  text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                                >
                                <div className='flex flex-col justify-center items-center'>
                                    <FaInfoCircle size={16} className="text-blue-500" />
                                    {hoveredDetails[2]}
                                </div>
                                </div>
                            )}
                            {value}
                            <MdDescription />
                            
                        </div>;
            },
            dataRender: (index, value, currentItem) => {

                // const props = {
                //     courseList: JSON.stringify(currentItem.courseList),
                //     instructorName: currentItem.instructorName,
                // }

                // const queryString = Object.keys(props)
                //     .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(props[key])}`)
                //     .join('&');
                
                return  <div className='flex flex-col w-full justify-end items-end'>
                            <textarea value={value} onChange={() => {}} className='w-[8rem] h-[3rem] text-center resize-none outline-none text-blue-700 font-bold ' />

                            <div
                            onClick={() => {
                                let item = currentItem;
                                item.startTime = convertTimeObjectToIsoString(item.startTime);
                                item.endTime = convertTimeObjectToIsoString(item.endTime);
                                dispatch(setCourseEntity(item));
                                // console.log("Item", item);
                                navigate('/course/students-enrolled')
                            }}
                            className={`cursor-alias text-blue-600 font-bold flex justify-center items-center`}>

                                <IoMdOpen />
                            </div>
                            
                        </div>
            } 
        },
        { // Users
            header : 'Users',
            dataKey: 'studentRegistered', 
            label: 'Student Registered', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,value,currentItem) => {
                        // alert('Entered')
                        setHoveredDetails([index,currentItem.courseCode,'Number of students registered in the course','studentRegistered']);
                    },
                    onMouseLeave: (index,value,currentItem) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index,value,currentItem) => {
                return <div
                            // onMouseEnter={() => handleMouseEnter([index,currentItem.courseCode,'editSchedulecolumn'])}
                            onMouseLeave={handleMouseLeave} 
                            className={`g:cursor-help w-full h-full flex flex-wrap text-start justify-start items-center relative `}
                        >
                            {hoveredDetails.length > 0 &&
                            hoveredDetails[0] === index && hoveredDetails[1] === currentItem.courseCode &&
                            hoveredDetails[3] === 'studentRegistered' && (
                                <div
                                className={`hidden lg:flex w-[10rem] text-center justify-center items-center  text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                                >
                                <div className='flex flex-col justify-center items-center'>
                                    <FaInfoCircle size={16} className="text-blue-500" />
                                    {hoveredDetails[2]}
                                </div>
                                </div>
                            )}
                            {value}
                            
                        </div>;
            },
            dataRender: (index, value, currentItem) => {
                return  <div
                            className={` w-full h-full text-lg font-bold flex text-slate-500 flex-wrap justify-end items-center`}
                        >
                            {currentItem.enrolledStudentsList ? currentItem.enrolledStudentsList.length : '0'}
                            
                        </div>;
            }
        },
        { // Attempts
            header : 'Attempts',
            dataKey: 'attempts', 
            label: 'Student Attempts', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,value,currentItem) => {
                        // alert('Entered')
                        setHoveredDetails([index,currentItem.courseCode,'Total number of times a student can attempt the course','attempts']);
                    },
                    onMouseLeave: (index,value,currentItem) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index,value,currentItem) => {
                return <div
                            // onMouseEnter={() => handleMouseEnter([index,currentItem.courseCode,'editSchedulecolumn'])}
                            onMouseLeave={handleMouseLeave} 
                            className={`lg:cursor-help w-full h-full flex flex-wrap text-start justify-start items-center relative `}
                        >
                            {hoveredDetails.length > 0 &&
                            hoveredDetails[0] === index && hoveredDetails[1] === currentItem.courseCode &&
                            hoveredDetails[3] === 'attempts' && (
                                <div
                                className={`hidden lg:flex w-[10rem] text-center  justify-center items-center  text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                                >
                                <div className='flex flex-col justify-center items-center'>
                                    <FaInfoCircle size={16} className="text-blue-500" />
                                    {hoveredDetails[2]}
                                </div>
                                </div>
                            )}
                            {value}
                            
                            <FaPencilAlt size={9} className='mb-3 ml-1' />
                            
                        </div>;
            },
            rowFunctionality: {
                
                event: {
                    onClick : (index) => {
                        if(showFormIndex1 === null)
                            setShowFormIndex1(index);
                    },
                },
                action: (currentItem,index) => {
                    return showFormIndex1 === index && form(currentItem,editAttemptsFormData,setShowFormIndex1,editAttempts)
                }

            },
            dataRender: (index, value, currentItem) => {
                return <p 
                        className={`w-full h-[3rem] bg-emerald-400 rounded-md   text-gray-900 font-bold text-lg flex justify-center items-center `}>
                            {value}
                        </p>
            } 
        },
        { // Archive
            header : 'Archive',
            dataKey: 'archive', 
            label: 'Archive', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,value,currentItem) => {
                        // alert('Entered')
                        setHoveredDetails([index,currentItem.courseCode,'Archive this course','archive']);
                    },
                    onMouseLeave: (index,value,currentItem) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index,value,currentItem) => {
                return <div
                            // onMouseEnter={() => handleMouseEnter([index,currentItem.courseCode,'editSchedulecolumn'])}
                            onMouseLeave={handleMouseLeave} 
                            className={`lg:cursor-help w-full h-full flex flex-wrap text-start justify-start items-center relative `}
                        >
                            {hoveredDetails.length > 0 &&
                            hoveredDetails[0] === index && hoveredDetails[1] === currentItem.courseCode &&
                            hoveredDetails[3] === 'archive' && (
                                <div
                                className={`hidden lg:flex w-[10rem] text-center justify-center items-center  text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                                >
                                <div className='flex flex-col justify-center items-center'>
                                    <FaInfoCircle size={16} className="text-blue-500" />
                                    {hoveredDetails[2]}
                                </div>
                                </div>
                            )}
                            {value}
                            
                            <FaPencilAlt size={9} className='mb-3 ml-1' />
                            
                        </div>;
            },
            rowFunctionality: {
                
                event: {
                    onClick : (index) => {
                        if(showFormIndex2 === null)
                            setShowFormIndex2(index);
                    },
                },
                action: (currentItem,index) => {
                    return showFormIndex2 === index && form(currentItem,editArchiveFormData,setShowFormIndex2,editArchive)
                }

            },
            dataRender: (index, value, currentItem) => {
                return <p 
                        className={`w-full h-[3rem] bg-blue-400 rounded-md flex font-bold justify-center items-center`}>

                            {value === true ? 'Yes' : 'No'}
                        </p>
            } 
        },
        { // License Left
            header : 'Licenses',
            dataKey: 'licenses', 
            label: 'Licenses', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,value,currentItem) => {
                        // alert('Entered')
                        setHoveredDetails([index,currentItem.courseCode,'Total number of licenses left for this course','licenses']);
                    },
                    onMouseLeave: (index,value,currentItem) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index,value,currentItem) => {
                return <div
                            // onMouseEnter={() => handleMouseEnter([index,currentItem.courseCode,'editSchedulecolumn'])}
                            onMouseLeave={handleMouseLeave} 
                            className={`lg:cursor-help w-full h-full flex flex-wrap text-start justify-start items-center relative `}
                        >
                            {hoveredDetails.length > 0 &&
                            hoveredDetails[0] === index && hoveredDetails[1] === currentItem.courseCode &&
                            hoveredDetails[3] === 'licenses' && (
                                <div
                                className={`hidden lg:flex w-[10rem] text-center justify-center items-center  text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                                >
                                <div className='flex flex-col justify-center items-center'>
                                    <FaInfoCircle size={16} className="text-blue-500" />
                                    {hoveredDetails[2]}
                                </div>
                                </div>
                            )}
                            {value}
                            
                        </div>;
            },
            
              
            dataRender: (index, value, currentItem) => {
                return  <div
                            className={`w-1/2 h-full text-start text-slate-500 font-bold flex flex-wrap justify-end items-center`}
                        >
                            {value}
                            
                        </div>;
            }
        },
        { // Schedule
            header : 'Schedule',
            dataKey: 'editSchedule', 
            label: 'Edit Schedule', 
            columnFunctionality : {
                event: {
                    onMouseEnter: (index,value,currentItem) => {
                        // alert('Entered')
                        setHoveredDetails([index,currentItem.courseCode,'Edit schedule to attempt the course','editSchedulecolumn']);
                    },
                    onMouseLeave: (index,value,currentItem) => {
                        setHoveredDetails([]);
                    }
                },
    
            },
            columnRender: (index,value,currentItem) => {
                return <div
                            // onMouseEnter={() => handleMouseEnter([index,currentItem.courseCode,'editSchedulecolumn'])}
                            onMouseLeave={handleMouseLeave} 
                            className={`lg:cursor-help w-full h-full flex flex-wrap text-start justify-start items-center relative `}
                        >
                            {hoveredDetails.length > 0 &&
                            hoveredDetails[0] === index && hoveredDetails[1] === currentItem.courseCode &&
                            hoveredDetails[3] === 'editSchedulecolumn' && (
                                <div
                                className={`hidden lg:flex w-[10rem] text-center justify-center  items-center  text-sm absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 px-2 rounded shadow-md border border-gray-300 z-1001`}
                                >
                                <div className='flex flex-col justify-center items-center'>
                                    <FaInfoCircle size={16} className="text-blue-500" />
                                    {hoveredDetails[2]}
                                </div>
                                </div>
                            )}
                            {value}
                            
                            <FaPencilAlt size={9} className='mb-3 ml-1' />
                            
                        </div>;
            },
            rowFunctionality: {
                
                event: {
                    onClick : (index) => {
                        if(showFormIndex3 === null)
                            setShowFormIndex3(index);
                    },
                },
                action: (currentItem,index) => {
                    return showFormIndex3 === index && form(currentItem,editScheduleFormData,setShowFormIndex3,editSchedule)
                }

            },
            dataRender: (index, value, currentItem) => {
                console.log("Date Render Start time",currentItem.startTime);

                console.log("CurrentItem",currentItem);
                return  <div className='w-full h-[3rem] sm:h-auto sm:w-[11.2rem] sm:ml-[-1.55rem] bg-[#f5f467] py-2 rounded-md  flex flex-col justify-center items-center'>
                            
                            <input contentEditable={false} value={formatToCustomString(currentItem.startTime)} onChange={() => {}} className='bg-[#f5f467] hidden pl-1 cursor-pointer outline-none sm:flex w-full h-[2rem] justify-center items-center' />

                            <p className='text-xs hidden sm:flex bg-[#f5f467] '>
                                to
                            </p>

                            <input contentEditable={false} value={formatToCustomString(currentItem.endTime)} onChange={() => {}} className='bg-[#f5f467] hidden pl-1 cursor-pointer outline-none sm:flex w-full h-[2rem] justify-center items-center' />

                            <p 
                            onMouseEnter={() => handleMouseEnter([index,'editSchedule'])}
                            onMouseLeave={handleMouseLeave} 
                            className={`w-full h-[1rem] flex  justify-center items-center ${hoveredDetails.length > 0 && hoveredDetails[0] === index && hoveredDetails[1] === 'editSchedule' ? ' animate-bounce' : ''}`}>

                                <FaBell size={15} className='text-slate-700 cursor-pointer' />
                            </p>
                        </div>
            } 
        },
    ];

    // cardColumnsDescription ends here 

    const handleMouseEnter = (details) => {
        clearTimeout(animationTimeout);

        animationTimeout = setTimeout(() => {
            setHoveredDetails(details);
        }, 400);
        // setHoveredDetails(details);
    };
    
    const handleMouseLeave = () => {
        clearTimeout(animationTimeout);

        setHoveredDetails([]);
    };

    return loading ? (
        <Loading1 />
    ) : 
    (
        <div className='w-full h-auto mt-7 flex flex-col justify-center items-center'>
            {/* Heading section */}
            <div className='w-full mb-7 flex justify-center items-center '>
                <div>
                    <h1 className="text-4xl font-bold hover:text-gray-600 cursor-default">Instructor Home</h1>
                </div>
            </div>

            <div className={`w-full ${(messages.length > 0 || errors.length > 0) && 'mb-9'}`}>
                {/* Messages section */}
                {messages.length > 0 && 
                    <div className='w-full flex justify-center items-center'>
                        <Messages messages={messages} messageType='success' setMessages={setMessages} />
                    </div>
                }
                
                {/* Errors section */}
                {errors.length > 0 && 
                    <div className='w-full flex justify-center items-center mt-4'>
                        <Messages messages={errors} messageType='error' setMessages={setErrors} />
                    </div>
                }
            </div>

            {/* search email section */}
            <div className="w-full flex flex-col justify-center items-center">
                <SearchEngine items={items} setFilteredItems={setFilteredItems} enableSuggestion enableContinuousSearching={false} searchProperty="courseName" width='lg:w-[35%]' />
            </div>

            {displayFormat === 'Table' && 
                <TablePagination columnsDescription={tableColumnsDescription} items={filteredItems} showRowNumbers={true} columnsDesign='cursor-default bg-[#a7b1c7] border-gray-500 text-slate-800 border' rowsDesign='hover:bg-gray-200 cursor-default border' errorMessage='No Courses Found!' />
            }
            
            {displayFormat === 'Card' && 
                <CardPagination columnsDescription={cardColumnsDescription} items={filteredItems} showRowNumbers={true} columnsDesign='' rowsDesign='' errorMessage='No Courses Found!' />
            }
            
            {/* Select display format as Table or Card */}
            <div className='w-full mb-8 flex justify-center items-center'>
                <p className='text-green-600 font-lg font-bold cursor-default'>
                    Select display option :
                </p>
                
                <select
                    value={displayFormat}
                    onChange={ event => setDisplayFormat(event.target.value) }
                    className="flex justify-center items-center appearance-none bg-white border border-gray-400 text-gray-700 ml-6 py-2 px-4 rounded leading-tight focus:outline-none focus:border-gray-500"
                >
                    <option value="Table">Table</option>
                    <option value="Card">Card</option>
                </select>
            </div>
        </div>
    )
};

export default InstructorHome
