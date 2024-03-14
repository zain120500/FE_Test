const dateToTimeAgo = (dateString: any) => {
    const date: any = new Date(dateString);
    const now: any = new Date();
    const elapsed = now - date;

    // Convert elapsed time to seconds
    const seconds = Math.floor(elapsed / 1000);

    // Define time intervals in seconds
    const intervals: any = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    // Calculate the appropriate time interval
    for (let interval in intervals) {
        const secondsInterval = intervals[interval];
        const intervalCount = Math.floor(seconds / secondsInterval);

        if (intervalCount >= 1) {
            return intervalCount === 1 ? `1 ${interval} ago` : `${intervalCount} ${interval}s ago`;
        }
    }

    return 'Just now'; // If the date is in the future or just now
}

const isNullOrEmpty = (input: any) => {
    return input == null || input == "" || input == 0;
  };

export {
    dateToTimeAgo,
    isNullOrEmpty
}