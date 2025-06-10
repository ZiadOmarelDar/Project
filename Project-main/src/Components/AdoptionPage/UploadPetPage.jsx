import { useState, useRef } from "react";
import uploadIcon from "../../assets/adoption/Frame.png"
export default function UploadPetPage() {

   const [fileName, setFileName] = useState('The first image it will be the hero image');
   const [images, setImages] = useState([]);
   const [formData, setFormData] = useState({
      petName: '',
      age: '',
      breed: '',
      type: '',
      healthStatus: '',
      vaccinations: '',
      notes: '',
      ownerName: '',
      ownerLocation: '',
      ownerPhoneNumber: '',
   });
   const fileInputRef = useRef(null);
   const [btnText, setBtnText] = useState("Submit");
   function handleChange(e){
      setFormData({...formData,[e.target.name]: e.target.value})
   }
   const handleFileChange = (e) => {
   const file = e.target.files[0];
   setFileName(file ? file.name : 'No file chosen');
   };
   const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      setImages(files);
   }

   function handleSubmit (e){
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
      navigate("/login");
      return;
      }
      // console.log(formData)
      const data = new FormData();

  // Append text fields
  for (const key in formData) {
    data.append(key, formData[key]);
  }

  // Append images
  images.forEach((img) => {
    data.append("images", img); // "images" must match multer field name
  });

      fetch("http://localhost:3001/pets", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}` // If your auth middleware expects a token
  },
  body: data
})
.then(res => res.json())
.then(data => {setBtnText(data.message || "Pet data uploaded successfully!" ); console.log("result from the backend:", data);} )
.catch(err => console.error(err));
   fileInputRef.current.value = "";
}

const x = {
   
}
   return(
      <>
         <h1 style={{margin:"60px 0 60px 30px"}} className="text-[#323773] text-5xl text-center md:text-start font-semibold my-7">Upload Animal Data</h1>
         <form style={{margin:"60px 50px", paddingInline:"20px"}} className="" onSubmit={handleSubmit}>
            <div className="md:flex-row flex flex-col md:justify-center md:gap-30 md:items-start">
               <div style={{marginBottom:"30px"}} className="flex flex-col gap-3 md:basis-[45%]">
                  <label className="text-black text-lg font-semibold">Pet Name</label>
                  <input 
                  type="text" 
                  name="petName"
                  placeholder="Enter pet name" 
                  className="rounded-md p-2 outline-none" 
                  style={{border:"1px solid #656ED3"}}
                  onChange={handleChange}
                  />
                  <label className="text-black text-lg font-semibold">Age:</label>
                  <input 
                  type="number" 
                  name="age"
                  placeholder="Enter pet age" 
                  className="rounded-md p-2 outline-none" 
                  style={{border:"1px solid #656ED3"}}
                  onChange={handleChange}
                  min={0}
                  />
                  <label className="text-black text-lg font-semibold">Breed:</label>
                  <input 
                  type="text" 
                  name="breed"
                  placeholder="Enter pet Breed" 
                  className="rounded-md p-2 outline-none" 
                  style={{border:"1px solid #656ED3"}} 
                  onChange={handleChange}
                  />
                  <label className="text-black text-lg font-semibold">Type:</label>
                  <div style={{marginBottom:"20px"}} className="flex gap-3 items-center">
                     <input name="type" value="Male" onChange={handleChange} style={{width:"20px",margin:"0 0 0 10px",height:"20px"}} type="radio" id="male" />
                     <label htmlFor="male" >Male</label>
                     <input name="type" value="Female" onChange={handleChange} style={{width:"20px",margin:"0 0 0 100px",height:"20px"}} type="radio" id="female" />
                     <label htmlFor="female">Female</label>
                     
                  </div>
                  <label className="text-black text-lg font-semibold">Health Status:</label>
                  <input
                  type="text" 
                  placeholder="Enter pet health status" 
                  className="rounded-md p-2 outline-none" 
                  name="healthStatus"
                  style={{border:"1px solid #656ED3"}} 
                  onChange={handleChange}
                  />
                  <label className="text-black text-lg font-semibold">Vaccinations:</label>
                  <input 
                  type="text" 
                  name="vaccinations"
                  placeholder="Enter pet vaccinations" 
                  className="rounded-md p-2 outline-none" 
                  style={{border:"1px solid #656ED3"}} 
                  onChange={handleChange}
                  />
                  <label className="text-black text-lg font-semibold">Notes:</label>
                  <textarea 
                  name="notes"
                  placeholder="Enter pet description" 
                  className="rounded-lg p-2 outline-none min-h-[100px]" 
                  style={{border:"1px solid #656ED3",padding:"10px",resize:"none"}} 
                  onChange={handleChange}
                  >

                  </textarea>
               </div>
               <div style={{marginBottom:"30px"}} className="flex flex-col gap-3 basis-[45%]">
                  <label className="text-black text-lg font-semibold">Upload Pet Image:</label>
                  <div style={{boxShadow: "0px 4px 4px 0px #00000040",backgroundColor:"white", borderRadius:"10px",padding:"10px"}} className="">
                     <h3 style={{padding:"10px 0 20px 20px",borderBottom:"1px solid #aaa", marginBottom:"10px"}} className="text-2xl font-semibold p-2.5">Image Upload</h3>
                     <label htmlFor="imageUpload" style={{margin:"10px 35px 15px",padding:"45px", border:"1px dashed #D4D4D4",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                        <img src={uploadIcon} alt="" style={{marginBottom:"10px"}} />
                        <span className="text-gray-500">Click or drag file to this area to upload</span>  
                        <input 
                           type="file" 
                           accept="image/*" 
                           multiple
                           name="images"
                           style={{border:'none',display:"none"}} 
                           id="imageUpload"
                           ref={fileInputRef}
                           onChange={(e) => {
                              handleFileChange(e);
                              handleImageChange(e);
                           }}
                        />
                     </label>
                     <span style={{marginLeft:"30px"}}>{images.map(i => <span key={i.name}>{i.name} + </span>) || "No file chosen"}</span>
                  </div>
                  <h1 style={{margin:"90px 0 20px 0"}} className="text-2xl text-[#323773] font-semibold">Owner Data:</h1>
                  <label className="text-black text-lg font-semibold">name:</label>
                  <input 
                  type="text" 
                  name="ownerName"
                  placeholder="Enter Your name" 
                  className="rounded-md p-2 outline-none" 
                  style={{border:"1px solid #656ED3"}} 
                  onChange={handleChange}
                  />
                  <label className="text-black text-lg font-semibold">Location:</label>
                  <input 
                  type="text"
                  name="ownerLocation" 
                  placeholder="Enter Location" 
                  className="rounded-md p-2 outline-none" 
                  style={{border:"1px solid #656ED3"}} 
                  onChange={handleChange}
                  />
                  <label className="text-black text-lg font-semibold">phone number:</label>
                  <input 
                  type="text" 
                  name="ownerPhoneNumber"
                  placeholder="Enter Your phone number" 
                  className="rounded-md p-2 outline-none" 
                  style={{border:"1px solid #656ED3"}} 
                  onChange={handleChange}
                  />
               </div>
            </div>
            <button type="submit" style={{margin:"auto",width:"60%", padding:"10px 0"}} className="bg-[#323773] text-white rounded-md block">{btnText}</button>
         </form>
      </>
   )
}