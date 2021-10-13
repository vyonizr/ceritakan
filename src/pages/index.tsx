import type { NextPage } from 'next'
import Head from 'next/head'
import server from 'src/config'

const Card = ({ question }: any) => (
  <div className='custom-flex-center h-96 w-72 border-2 border-gray-100 rounded-lg p-5 shadow-xl'>
    <div className='custom-flex-center relative rounded-2xl border-2 border-blue-900 w-full h-full p-4'>
      <p className='absolute top-4 right-0 w-full text-center text-3xl text-gray-700 font-roustel'>
        Ceritakan
      </p>
      <p className='text-gray-700 text-center subpixel-antialiased'>
        {question.question}
      </p>
    </div>
  </div>
)

const Home: NextPage = ({ question }: any) => {
  return (
    <div className='container flex flex-col justify-items-center items-center'>
      <Head>
        <title>Ceritakan</title>
        <meta
          name='description'
          content='Ceritakan adalah sebuah platform pertanyaan terbuka'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Card question={question} />
    </div>
  )
}

export const getServerSideProps = async () => {
  try {
    const response = await fetch(`${server}/questions/random`)
    const responseJSON = await response.json()

    return {
      props: {
        question: responseJSON.data,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        errorMessage: 'Terjadi galat. Mohon refresh browser Anda.',
      },
    }
  }
}

export default Home
