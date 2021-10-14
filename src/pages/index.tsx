import { useState, useEffect, Fragment } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import MoonLoader from 'react-spinners/MoonLoader'

import QuestionCard from 'src/components/QuestionCard'
import BackCard from 'src/components/BackCard'
import Footer from 'src/components/Footer'
import { Question } from 'src/common/types'

const FLIP_DURATION = 0.5
const FLIP_DEGREE = 180

const Home = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [questionFetch, setQuestionFetch] = useState({
    isLoading: false,
    data: {} as Question,
    error: '',
  })

  useEffect(() => {
    handleQuestionFetch()
  }, [])

  const handleReadIds = (questionId: number) => {
    const readQuestionIds: string = localStorage.getItem('read_ids') || ''
    if (readQuestionIds.length > 0) {
      localStorage.setItem(
        'read_ids',
        readQuestionIds + ',' + String(questionId)
      )
    } else {
      localStorage.setItem('read_ids', String(questionId))
    }
  }

  const toggleCard = () => {
    setIsOpen((state) => !state)
  }

  const handleQuestionFetch = () => {
    setQuestionFetch((state) => ({
      ...state,
      isLoading: true,
    }))

    setTimeout(() => {
      fetchQuestion()
    }, 1000)
  }

  const getNewCard = () => {
    toggleCard()
    handleQuestionFetch()
  }

  const startOver = () => {
    localStorage.setItem('read_ids', '')
    handleQuestionFetch()
  }

  const fetchQuestion = async () => {
    try {
      const read_ids: string = localStorage.getItem('read_ids') || ''
      const respone = await fetch(`/api/questions/random?read_ids=${read_ids}`)
      const responseJSON = await respone.json()
      handleReadIds(responseJSON.data.id)

      setQuestionFetch({
        isLoading: false,
        data: responseJSON.data,
        error: '',
      })
    } catch (error) {
      setQuestionFetch({
        isLoading: false,
        data: {} as Question,
        error: 'Ada yang salah nih. Coba di-refresh, ya.',
      })
    }
  }

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
      <div className='relative bottom-1/4'>
        {Object.keys(questionFetch.data).length === 0 &&
        !questionFetch.isLoading ? (
          <div className='custom-flex-center flex-col'>
            <p className='my-3'>{'Maaf, kartunya sudah habis ☹️'}</p>
            <button className='p-3 text-white bg-blue-500 rounded-lg font-medium'>
              <span className='text-white' onClick={startOver}>
                Mulai lagi
              </span>
            </button>
          </div>
        ) : (
          <Fragment>
            <div className='absolute'>
              <motion.div
                className='relative backface-invisible'
                onTapStart={!questionFetch.isLoading ? toggleCard : undefined}
                initial={{ rotateY: isOpen ? FLIP_DEGREE : 0 }}
                animate={{ rotateY: isOpen ? FLIP_DEGREE : 0 }}
                transition={{ duration: FLIP_DURATION }}
              >
                <div className='absolute w-full h-full flex justify-center items-end pb-9'>
                  {!questionFetch.isLoading && !isOpen ? (
                    <button className='sonar'></button>
                  ) : (
                    <MoonLoader
                      color='#fff'
                      loading={questionFetch.isLoading}
                      size={40}
                    />
                  )}
                </div>
                <BackCard />
              </motion.div>
            </div>
            <motion.div
              className='relative backface-invisible'
              onTapStart={getNewCard}
              initial={{ rotateY: isOpen ? 0 : FLIP_DEGREE }}
              animate={{ rotateY: isOpen ? 0 : FLIP_DEGREE }}
              transition={{ duration: FLIP_DURATION }}
            >
              <QuestionCard question={questionFetch.data} />
            </motion.div>
          </Fragment>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Home
