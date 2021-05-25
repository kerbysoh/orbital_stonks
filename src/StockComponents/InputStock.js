import React ,{useState, useRef} from 'react'

function InputStock() {
    const [data,setData]=useState(null)
    const [print, setPrint]=useState(false)
    const input = useRef();
    const [watchList, setNewListItem] = useState([]);

    function addToList(val){
        val.preventDefault();
        setNewListItem([...watchList, input.current.value]);
        console.log(watchList.target.val);
    }

    function getData(val){
    console.log(val.target.value)
    setData(val.target.value)
    setPrint(false)
  }

    return (
        <div className="InputStock">
     {
       print?
       <h1> {data}</h1>
       :null
     }
    <input type="text" onChange={getData} ref={input}/>
    <btn ref={input} onClick={()=>setPrint(true) & addToList}>Add to Watchlist</btn>
    <h1>
        {watchList.map((item, b) => (
          <li key={b}>{item}</li>
        ))}
      </h1>
    </div>
    )
}

export default InputStock;
