import Image from 'next/image';

import placeholder from '../public/placeholder.png';
import styles from '../styles/List.module.css';
import LikedIcon from './icons/Liked';
import DislikedIcon from './icons/Disliked';
import UpdateIcon from './icons/Update';
import DeleteIcon from './icons/Delete';

export default function List({
  heading, albums, type, setCurrent, setLiked, setDisliked
}) {
  async function updateStatus(id, status, arrIndex) {
    // update album status in database.
    const response = await fetch(
      '/api/update/',
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status,
        }),
      },
    );

    // If database update is successful...
    // Remove the album from the current list that it's in...
    // Add it to the new list based on its new status...
    if (response.ok) {
      if (type === 'current') {
        // Get record of album to be moved.
        const album = albums.filter((album, i) => i === arrIndex);

        // Remove album from 'current' list and update state variable.
        const newCurrent = albums.filter((album, i) => i !== arrIndex);
        setCurrent(newCurrent);
        // Add album to new list.
        if ( 'liked' === status ) {
          setLiked()
        }
      }
    }
  }

  return (
        <div className={styles.container}>
            <h2 className="container">{ heading }</h2>
            <ul className={styles.grid}>
                <li className={styles.head}>
                    <p></p>
                    <p>Artwork</p>
                    <p>Artist</p>
                    <p>Album</p>
                    <p></p>
                </li>
                {albums.map((album, index) => (
                        <li className={styles.item} key={index}>
                            <div className="img-container">
                            <Image
                                width={150}
                                height={150}
                                src={
                                    album.image && album.image !== ''
                                      ? album.image
                                      : placeholder
                                }
                                alt=''
                            />
                            </div>

                            <h2>{album.name}</h2>
                            <p>{album.album}</p>
                            <p className={ styles.modify }>
                                <button className={styles.button} onClick={
                                    () => updateStatus(
                                      album._id,
                                      'liked',
                                      index,
                                    )
                                }>
                                    <LikedIcon />
                                </button>
                                <button className={styles.button} onClick={
                                    () => updateStatus(
                                      album._id,
                                      'disliked',
                                      index,
                                    )
                                }>
                                    <DislikedIcon />
                                </button>
                                <UpdateIcon />
                                <DeleteIcon />
                            </p>
                        </li>
                ))}
            </ul>
        </div>
  );
}