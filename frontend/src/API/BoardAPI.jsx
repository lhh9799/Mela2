import axios from 'axios';



const URL = 'http://localhost:8080/api/v1/board'

export const BoardAPI = axios.create({
  baseURL: 'http://localhost:8080/api/v1/board'
})

export const BoardList = async({page, size, sortKey, word}) => {
  const response = await BoardAPI.get(BoardAPI.baseURL, {
    params: {
      page,
      size,
      sortKey,
      word
    }
  })
  console.log(response)
  return response
}

export const BoardDetail = async({boardIdx}) => {
  const response = await BoardAPI.get(`/${boardIdx}`)
  return response
}


export const BoardCreate = async ({content, title}) => {
  try {
    const response = await BoardAPI.post(URL, {
      content,
      title
    }, {
      headers: {
        'Authorization' : `Bearer ${localStorage.accessToken}`
      }
    })
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const GetComment = async ({boardIdx}) => {
  const url = `/${boardIdx}/comments`;
  console.log('Request URL: ', url);  
  const Comments = await BoardAPI.get(url);
  console.log('Comments: ', Comments);
  return Comments;
}

export const CreateComment = async ({boardIdx, content}) => {
  const response = await BoardAPI.post(`${URL}/${boardIdx}/comments`,{
    content
  }, {
    headers : {
      'Authorization' : `Bearer ${localStorage.accessToken}`
    }
  })
  return response 
}

export const BoardUpdate = async ({ boardIdx, title, content }) => {
  const response = await BoardAPI.put(`/${boardIdx}`, {
    title,
    content
  }, {
    headers: {
      'Authorization': `Bearer ${localStorage.accessToken}`
    }
  });
  return response;
};

export const BoardPost = () => {}