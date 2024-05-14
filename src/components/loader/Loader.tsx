export const Loader = () => {
    return (
        <div className="d-flex justify-content-center text-secondary align-items-center" style={{ height: "100vh" }}>
            <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}