import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';


import Home from './home/Home';
import Login from './authentication/Login';
import Register from './authentication/Register';
import NoteList from './note/NoteList';
import NoteForm from './note/NoteForm';
import NoteDetail from './note/NoteDetail';




const App = () => {
    return (
        <AuthProvider>
            <Router>

            
                <Routes>
                  
                <Route path="/" element={
                     
                     <Home />
                
             } exact />
                    <Route path="/login" element={
                     
                            <Login />
                       
                    } exact />
                   <Route path="/register" element={
                     
                     <Register />
                
             } exact />

<Route path="/notes" element={
                     
                     <NoteList />
                
             } exact />
             <Route path="/notes/:id" element={
                     
                     <NoteDetail />
                
             } exact />
             <Route path="/add-note" element={
                     
                     <NoteForm />
                
             } exact />

<Route path="/edit-note/:id" element={
                     
                     <NoteForm />
                
             } exact />
                </Routes>
              
            </Router>
        </AuthProvider>
    );
};

export default App;
