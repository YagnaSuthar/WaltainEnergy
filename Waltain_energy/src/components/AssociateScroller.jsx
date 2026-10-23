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



export default function AssociateScroller({ className = '' }) {

  const images = useMemo(() => {

    const modules = import.meta.glob(
      '../assets/Channel partners and associates/*.{png,jpg,jpeg,webp,avif,svg,jfif}',
      {

        eager: true,

        import: 'default',

      },
    )



    return Object.entries(modules)

      .map(([path, src]) => {

        const filename = filenameFromPath(path)

        return {

          src,

          alt: titleFromFilename(filename) || 'Associate image',

          key: path,

        }

      })

  }, [])



  if (images.length === 0) return null



  const trackImages = [...images, ...images]



  return (

    <section className={`associate-scroller ${className}`.trim()} aria-label="Associate images">

      <div className="container">

        <div className="associate-scroller__header">

          <h2 className="associate-scroller__title">Channel partners and associates</h2>

        </div>

        <div className="associate-scroller__viewport">

          <div className="associate-scroller__track" aria-hidden="true">

            {trackImages.map((img, idx) => (

              <div className="associate-scroller__item" key={`${img.key}-${idx}`}>

                <img className="associate-scroller__img" src={img.src} alt={img.alt} loading="lazy" />

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  )

}

