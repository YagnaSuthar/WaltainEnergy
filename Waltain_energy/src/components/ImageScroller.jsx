import { useMemo } from 'react'



function filenameFromPath(path) {

  const cleaned = path.split('?')[0]

  const parts = cleaned.split('/')

  return parts[parts.length - 1] || ''

}



function titleFromFilename(filename) {

  const withoutExt = filename.replace(/\.[^.]+$/, '')

  return withoutExt

    .replace(/[-_]+/g, ' ')

    .replace(/\s+/g, ' ')

    .trim()

}



export default function ImageScroller({ className = '' }) {

  const images = useMemo(() => {

    const modules = import.meta.glob('../assets/images/*.{png,jpg,jpeg,webp,avif,svg}', {

      eager: true,

      import: 'default',

    })



    return Object.entries(modules)

      .filter(([path]) => filenameFromPath(path).toLowerCase() !== 'logo.png')

      .map(([path, src]) => {

        const filename = filenameFromPath(path)

        return {

          src,

          alt: titleFromFilename(filename) || 'Image',

          key: path,

        }

      })

  }, [])



  if (images.length === 0) return null



  const trackImages = [...images, ...images]



  return (

    <section className={`image-scroller ${className}`.trim()} aria-label="Project images">

      <div className="container">

        <div className="image-scroller__viewport">

          <div className="image-scroller__track" aria-hidden="true">

            {trackImages.map((img, idx) => (

              <div className="image-scroller__item" key={`${img.key}-${idx}`}>

                <img className="image-scroller__img" src={img.src} alt={img.alt} loading="lazy" />

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  )

}

