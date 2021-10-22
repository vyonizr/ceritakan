import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { motion } from 'framer-motion'
import SyncLoader from 'react-spinners/SyncLoader'
import { Topic } from 'src/common/types'
import { REGEX_URL } from 'src/helpers/regex'
import styles from 'src/styles/Submit.module.css'
import {
  MINIMUM_QUESTION_LENGTH,
  MAXIMUM_QUESTION_LENGTH,
  MAXIMUM_NAME_LENGTH,
  ANONYMOUS,
  IDENTIFIED,
  SITE_TITLE,
} from 'src/common/constants'

const ERROR_MESSAGE = 'Ada yang salah nih. Coba di-refresh, ya.'

type Inputs = {
  selectedTopicId: string
  question: string
  submitAs: string
  name?: string
  socialURL?: string
}

const questionValidator = {
  required: {
    value: true,
    message: 'Kamu harus mengisi pertanyaannya',
  },
  minLength: {
    value: MINIMUM_QUESTION_LENGTH,
    message: `Pertanyaanmu tidak boleh kurang dari ${MINIMUM_QUESTION_LENGTH} karakter`,
  },
  maxLength: {
    value: MAXIMUM_QUESTION_LENGTH,
    message: `Pertanyaanmu tidak boleh lebih dari ${MAXIMUM_QUESTION_LENGTH} karakter`,
  },
}

const Submit = () => {
  const [topics, setTopics] = useState({
    isLoading: true,
    data: [] as Topic[],
    error: '',
  })
  const [submitStatus, setSubmitStatus] = useState({
    isComplete: false,
    isLoading: false,
    error: '',
  })
  const [isModalCancelOpen, setIsModalCancelOpen] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      selectedTopicId: '',
      question: '',
      submitAs: ANONYMOUS,
      name: '',
      socialURL: '',
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setSubmitStatus((state) => ({ ...state, isLoading: true }))
      const { selectedTopicId, question, submitAs, name, socialURL } = data
      const body = {
        topic_id: selectedTopicId,
        question,
        submit_as: submitAs,
        name,
        social_url: socialURL,
      }

      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      const responseJSON = await response.json()
      if (responseJSON) {
        setSubmitStatus({
          isComplete: true,
          isLoading: false,
          error: '',
        })
      }
    } catch (error) {
      setSubmitStatus({
        isComplete: false,
        isLoading: false,
        error: 'Terjadi kesalahan saat mengirim. Coba lagi, ya.',
      })
    }
  }

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/topics')
        const responseJSON = await response.json()
        setTopics({
          isLoading: false,
          data: responseJSON.data,
          error: '',
        })
      } catch (error) {
        setTopics({
          isLoading: false,
          data: [] as Topic[],
          error: ERROR_MESSAGE,
        })
      }
    }

    fetchTopics()
  }, [])

  const ErrorMessage = ({ message }: { message: string | undefined }) => {
    return <small className='text-red-400'>{message}</small>
  }

  const isFormValid = () => {
    return (
      Object.keys(errors).length === 0 ||
      (watch('submitAs') === ANONYMOUS && (errors.name || errors.socialURL))
    )
  }

  const isPageLoading = () => {
    return topics.isLoading || submitStatus.isLoading
  }

  const isSubmissionCompleted = () => {
    return submitStatus.isComplete
  }

  const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
    return (
      <div className='absolute flex-col w-screen h-screen custom-flex-center'>
        <div className='z-20'>
          <SyncLoader color='#047857' loading={isLoading} size={16} />
        </div>
        <div className='absolute z-10 w-screen h-screen opacity-80 bg-gray-50 dark:bg-gray-900' />
      </div>
    )
  }

  const SumbissionConfirmation = () => {
    return (
      <div>
        <h1 className='text-4xl text-center'>Terima kasih!</h1>
        <h2 className='text-lg text-center'>
          Kiriman kamu akan kami cek terlebih dahulu, ya.
        </h2>
        <Link href='/'>
          <button className={`${styles['submit-button']}`}>
            Kembali ke Ceritakan
          </button>
        </Link>
      </div>
    )
  }

  const CancelSubmit = () => {
    return (
      <div className='absolute flex-col w-screen h-screen custom-flex-center dark:text-black'>
        <div className='z-20 flex-col p-3 rounded-md w-72 custom-flex-center bg-gray-50'>
          <h2 className='mb-4 text-lg text-center'>
            Apakah kamu batal mengirimkan pertanyaan?
          </h2>
          <div className='grid grid-cols-2 w-max gap-x-5'>
            <Link href='/'>
              <button className='px-5 py-3 font-medium text-white bg-red-400 rounded-lg'>
                <span>Batal</span>
              </button>
            </Link>
            <button
              className='px-5 py-3 font-bold rounded-lg text-bold'
              onClick={() => setIsModalCancelOpen(false)}
            >
              Tidak
            </button>
          </div>
        </div>
        <div className='absolute z-10 w-screen h-screen bg-gray-900 opacity-80' />
      </div>
    )
  }

  return (
    <>
      {!isSubmissionCompleted() && isPageLoading() && (
        <LoadingOverlay isLoading={isPageLoading()} />
      )}
      {isModalCancelOpen && <CancelSubmit />}
      <div className='relative grid items-center h-screen w-72'>
        <Head>
          <title>{`Kirim Pertanyaan | ${SITE_TITLE}`}</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Head>
        {!isSubmissionCompleted() && (
          <>
            {watch('question').length > 0 ? (
              <img
                className='absolute right-0 cursor-pointer top-3'
                src='/icons/close-icon.svg'
                alt='Close icon'
                onClick={() => setIsModalCancelOpen(true)}
              />
            ) : (
              <Link href='/'>
                <img
                  className='absolute right-0 cursor-pointer top-3'
                  src='/icons/close-icon.svg'
                  alt='Close icon'
                />
              </Link>
            )}
          </>
        )}
        {isSubmissionCompleted() && <SumbissionConfirmation />}
        {!isSubmissionCompleted() && (
          <motion.div
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className='container flex-col self-start mt-14 custom-flex-center'
          >
            <h1 className='mb-5 text-3xl'>Kirim Pertanyaan</h1>
            <form
              className='container flex-col custom-flex-center'
              onSubmit={handleSubmit(onSubmit)}
            >
              <select
                defaultValue=''
                className='mb-2 rounded form-select'
                {...register('selectedTopicId', { required: true })}
              >
                <option value='' disabled>
                  Pilih Topik
                </option>
                {topics.data.map((topic, index) => (
                  <option
                    key={index}
                    value={topic.id}
                  >{`${topic.icon} ${topic.name}`}</option>
                ))}
              </select>
              {watch('selectedTopicId') !== '' && (
                <>
                  <div className='container mb-4'>
                    <textarea
                      className='block w-full p-3 rounded resize-none border-primary form-textarea'
                      placeholder='Tulis pertanyaanmu di sini'
                      autoComplete='off'
                      {...register('question', questionValidator)}
                    />
                    {errors.question && (
                      <ErrorMessage message={errors.question.message} />
                    )}
                  </div>
                  <span>Kirim sebagai:</span>
                  <select
                    defaultValue={ANONYMOUS}
                    className='rounded form-select'
                    {...register('submitAs')}
                  >
                    <option value={ANONYMOUS}>😶 Anonim</option>
                    <option value={IDENTIFIED}>😄 Non-Anonim</option>
                  </select>
                  {watch('submitAs') !== ANONYMOUS && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className='container'
                    >
                      <div className='my-2'>
                        <input
                          type='text'
                          className='container rounded form-input'
                          placeholder='Nama kamu'
                          autoComplete='off'
                          {...register('name', {
                            required: {
                              value: watch('submitAs') !== ANONYMOUS,
                              message: 'Kamu harus memasukkan nama kamu',
                            },
                            maxLength: {
                              value: MAXIMUM_NAME_LENGTH,
                              message: `Nama tidak bisa lebih dari ${MAXIMUM_NAME_LENGTH} karakter`,
                            },
                          })}
                        />
                        {errors.name && (
                          <ErrorMessage message={errors.name.message} />
                        )}
                      </div>
                      <input
                        type='text'
                        className='container rounded form-input'
                        placeholder='Link sosmed (opsional)'
                        autoComplete='off'
                        {...register('socialURL', {
                          pattern: {
                            value: REGEX_URL,
                            message: `Contoh link: "https://twitter.com/twitter" (tanpa tanda kutip)`,
                          },
                        })}
                      />
                      {errors.socialURL && (
                        <ErrorMessage message={errors.socialURL.message} />
                      )}
                    </motion.div>
                  )}
                  <button
                    type='submit'
                    className={
                      isFormValid()
                        ? styles['submit-button']
                        : `${styles['submit-button']} cursor-not-allowed opacity-50`
                    }
                  >
                    Kirim
                  </button>
                  {submitStatus.error.length > 0 && (
                    <ErrorMessage message={submitStatus.error} />
                  )}
                </>
              )}
            </form>
          </motion.div>
        )}
      </div>
    </>
  )
}

export default Submit
