import { useContext } from 'react'
import mortContext from "../context/mort/mortContext"

const SnapHistory = () => {

  const context = useContext(mortContext);
  const {screenshots} = context;
  
  return (
     <div style={{ marginTop: "20px" }}>
        <h3>Stored Screenshots (Latest First)</h3>
        {screenshots.map((shot, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <img
              src={shot}
              alt={`screenshot-${index}`}
              style={{ maxWidth: "100%", border: "1px solid #ccc" }}
            />
          </div>
        ))}
      </div>

  )
}

export default SnapHistory