import React from "react";
import "./news.css"
import { Toaster, toast } from "sonner";
import axios from "axios";

export default function News(){
    // Const
    const [subject, setSubject] = React.useState('Subject');
    const [content, setContent] = React.useState('Your email content...');

    // Handler functions
    const handleSubjectChange = (e : any) => {
        setSubject(e.target.value);
    };

    const handleContentChange = (e : any) => {
        setContent(e.target.value);
    };

    // On Click
    const handleSendButton = () => {
        //Form data to send backend
        const formData = new FormData()

        // formData.append("email", content) ganti sama email admin
        formData.append("subject", subject)
        formData.append("content", content)

        //Toast promise
        toast.promise(
            axios.post('http://localhost:3000/newsletter/broadcast/new', formData),
            {
                loading: 'Broadcasting the newsletter...',
                success: () => {
                    return "Broadcast success!"
                },
                error: (error) => {
                    console.log(error);
                    return "Error while broadcasting newsletter!"
                }
            }
        )
    }

    return(
        <div className="sub-page-container">
            <Toaster position="bottom-right" richColors/>
            <div className="news-container">
                <h1>Broadcast New Email To Subscribers</h1>
                <span className="divider-span"/>
                <div className="content">
                    <input type="text" value={subject} onChange={handleSubjectChange} className="h1-style"/>
                    <textarea value={content} onChange={handleContentChange} className="span-style"/>
                </div>
                <span className="divider-span"/>
                <div className="button-group">
                    <button>Template &nbsp; ▼</button>
                    <button onClick={handleSendButton}>Send &nbsp; </button>
                </div>
            </div>
        </div>
    )
}