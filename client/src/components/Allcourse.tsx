import { useEffect, useState } from 'react'
import './Allcourse.css'
import Cards from './Cards'
import baseURL from './config.js'
import axios from 'axios'

const Allcourse = () => {
  const [courseArray, setCoursearray] = useState([]);

  const api = axios.create({
    baseURL
  });

  useEffect(() => {

    async function call() {
      const data = await api.get('/admin/courses',
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
          }
        })
      // console.log(data.data)
      setCoursearray(data.data.course);
    }
    call();
  }, []);

  return (
    <>
      <h1 id="allcourse-heading">All courses</h1>
      <div id="allcourse-div">
        {
          courseArray.map((item, index) => {
            return (
              <>
                <Cards key={index} title={item.title} description={item.description} price={item.price} linkImage={item.linkImage} />
              </>
            )
          })
        }
      </div>
    </>
  )
}

export default Allcourse