import { Container, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "450px" }}>
                <Card className='p-2'>
                    <Card.Body>
                        <h2 className='text-center mb-4 display-1'>Login</h2>
                        <div className="w-100 text-center mt-5 mb-4 ">
                            <Link className='text-white' to='/student-login'><Button className='w-100'><p className='display-6 m-0'>Student?</p></Button></Link>
                        </div>
                        <div className="w-100 text-center mt-4 ">
                            <Link className='text-white' to='/teacher-login'><Button className='w-100'><p className='display-6 m-0'>Teacher?</p></Button></Link>
                        </div>
                    </Card.Body>
                </Card>

            </div>
        </Container>
    )
}
