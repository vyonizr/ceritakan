import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import MoonLoader from 'react-spinners/MoonLoader'

import { server } from 'src/config'
import QuestionCard from 'src/components/QuestionCard'
import BackCard from 'src/components/BackCard'
import { HomePageProps, Question } from 'src/common/types'

const FLIP_DURATION = 0.5
const FLIP_DEGREE = 180

const Home = ({ question }: HomePageProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [questionFetch, setQuestionFetch] = useState({
    isLoading: false,
    data: {} as Question,
    error: '',
  })

  useEffect(() => {
    setQuestionFetch({
      isLoading: false,
      data: { ...question },
      error: '',
    })
  }, [])

  const toggleCard = () => {
    setIsOpen((state) => !state)
  }

  const getNewCard = () => {
    toggleCard()
    setQuestionFetch((state) => ({
      ...state,
      isLoading: true,
    }))
    setTimeout(() => {
      switchQuestion()
    }, 1000)
  }

  const switchQuestion = async () => {
    try {
      const respone = await fetch('/api/questions/random')
      const responseJSON = await respone.json()

      setQuestionFetch({
        isLoading: false,
        data: responseJSON.data,
        error: '',
      })
    } catch (error) {
      setQuestionFetch({
        isLoading: false,
        data: {} as Question,
        error: 'Terjadi kesalahan. Silakan reload halaman.',
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
      </div>
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
        errorMessage: null,
      },
    }
  } catch (error) {
    return {
      props: {
        question: null,
        errorMessage: 'Ada yang salah nih. Coba di-refresh, ya.',
      },
    }
  }
}

export default Home
