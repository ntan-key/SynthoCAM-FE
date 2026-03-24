import { ScrollPanel } from 'primereact/scrollpanel';
import VideoTile from './VideoTile';

const FileManager = () => {
    // JS goes here
    return (
            <div className='flex flex-col w-70 border-x border-border p-5 overflow-y-scroll h-full gap-3'>
                <VideoTile></VideoTile>
                <VideoTile></VideoTile>
                <VideoTile></VideoTile>
                <VideoTile></VideoTile>
                <VideoTile></VideoTile>
                <VideoTile></VideoTile>
                <VideoTile></VideoTile>
                <VideoTile></VideoTile>
                <VideoTile></VideoTile>
                <VideoTile></VideoTile>
            </div>
    )
}

export default FileManager