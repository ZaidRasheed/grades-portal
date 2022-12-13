export default function LoadingSpinner() {
    return (
        <div style={{ height: '100vh' }} className='d-flex  align-items-center justify-content-center'>
            <h2 className='mx-3'>Loading</h2>
            <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
