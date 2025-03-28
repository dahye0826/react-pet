import { useState, useEffect } from "react"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "./PostListPage.css"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Form from 'react-bootstrap/Form';

function PostDetailPage(){
    return(
            <>
            <Navbar/>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
            </Form>
            <Footer/>
            </>
          );
        }
    
export default PostDetailPage
