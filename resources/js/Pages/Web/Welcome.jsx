import AppLogo from '@/Components/app-logo'
import WebLayout from '@/Layouts/WebLayout'

const Welcome = () => {
  return (
    <div className='p-4 min-h-screen flex flex-col items-center gap-4 justify-center'>
      <div className='size-52'>
        <AppLogo />
      </div>
      <div className='text-center uppercase'>
        <h1 className='font-black text-4xl text-primary'>ZAS</h1>
        <h1 className='font-black text-4xl max-w-[700px]'>DIGITAL INSTITUTE TRAINING AND DEVELOPMENT SERVICES</h1>
      </div>
    </div>
  )
}

Welcome.layout = page => <WebLayout children={page} />

export default Welcome